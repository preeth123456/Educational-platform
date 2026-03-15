from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.utils.decorators import method_decorator
from django.views import View
from django.core.paginator import Paginator
import json
from datetime import datetime, timedelta
from .models import Product, PricingPlan, UserSubscription

def json_response(success=True, data=None, message="", status=200):
    return JsonResponse({
        'success': success,
        'data': data,
        'message': message
    }, status=status)

@method_decorator(csrf_exempt, name='dispatch')
class ProductListView(View):
    def get(self, request):
        try:
            products = Product.objects.all().order_by('-created_at')
            data = []
            for product in products:
                data.append({
                    'id': product.id,
                    'name': product.name,
                    'code': product.code,
                    'product_type': product.product_type,
                    'audience_role': product.audience_role,
                    'description': product.description,
                    'features_json': product.features_json,
                    'is_active': product.is_active,
                    'created_at': product.created_at.isoformat(),
                })
            return json_response(data=data)
        except Exception as e:
            return json_response(success=False, message=str(e), status=500)
    
    def post(self, request):
        try:
            data = json.loads(request.body)
            product = Product.objects.create(
                name=data['name'],
                code=data['code'],
                product_type=data.get('product_type', ''),
                audience_role=data.get('audience_role', ''),
                description=data.get('description', ''),
                features_json=data.get('features_json', []),
                is_active=data.get('is_active', True)
            )
            return json_response(data={'id': product.id}, message="Product created successfully")
        except Exception as e:
            return json_response(success=False, message=str(e), status=400)

@method_decorator(csrf_exempt, name='dispatch')
class ProductDetailView(View):
    def get(self, request, product_id):
        try:
            product = Product.objects.get(id=product_id)
            data = {
                'id': product.id,
                'name': product.name,
                'code': product.code,
                'product_type': product.product_type,
                'audience_role': product.audience_role,
                'description': product.description,
                'features_json': product.features_json,
                'is_active': product.is_active,
                'created_at': product.created_at.isoformat(),
            }
            return json_response(data=data)
        except Product.DoesNotExist:
            return json_response(success=False, message="Product not found", status=404)
        except Exception as e:
            return json_response(success=False, message=str(e), status=500)
    
    def put(self, request, product_id):
        try:
            product = Product.objects.get(id=product_id)
            data = json.loads(request.body)
            
            product.name = data.get('name', product.name)
            product.code = data.get('code', product.code)
            product.product_type = data.get('product_type', product.product_type)
            product.audience_role = data.get('audience_role', product.audience_role)
            product.description = data.get('description', product.description)
            product.features_json = data.get('features_json', product.features_json)
            product.is_active = data.get('is_active', product.is_active)
            product.save()
            
            return json_response(message="Product updated successfully")
        except Product.DoesNotExist:
            return json_response(success=False, message="Product not found", status=404)
        except Exception as e:
            return json_response(success=False, message=str(e), status=400)

@csrf_exempt
def toggle_product_status(request, product_id):
    if request.method == 'PATCH':
        try:
            product = Product.objects.get(id=product_id)
            product.is_active = not product.is_active
            product.save()
            return json_response(message=f"Product {'activated' if product.is_active else 'deactivated'}")
        except Product.DoesNotExist:
            return json_response(success=False, message="Product not found", status=404)
        except Exception as e:
            return json_response(success=False, message=str(e), status=500)

@method_decorator(csrf_exempt, name='dispatch')
class PricingPlanListView(View):
    def get(self, request):
        try:
            plans = PricingPlan.objects.select_related('product').all().order_by('-created_at')
            data = []
            for plan in plans:
                data.append({
                    'id': plan.id,
                    'name': plan.name,
                    'product': {
                        'id': plan.product.id,
                        'name': plan.product.name,
                        'code': plan.product.code,
                        'description': plan.product.description,
                        'features_json': plan.product.features_json,
                    },
                    'billing_cycle': plan.billing_cycle,
                    'price': float(plan.price),
                    'currency': plan.currency,
                    'discount_percent': float(plan.discount_percent),
                    'duration_days': plan.duration_days,
                    'limits_json': plan.limits_json,
                    'is_default': plan.is_default,
                    'is_recommended': plan.is_recommended,
                    'is_active': plan.is_active,
                    'created_at': plan.created_at.isoformat(),
                })
            return json_response(data=data)
        except Exception as e:
            return json_response(success=False, message=str(e), status=500)
    
    def post(self, request):
        try:
            data = json.loads(request.body)
            product = Product.objects.get(id=data['product_id'])
            
            plan = PricingPlan.objects.create(
                product=product,
                name=data['name'],
                billing_cycle=data.get('billing_cycle', ''),
                price=data['price'],
                currency=data.get('currency', 'INR'),
                discount_percent=data.get('discount_percent', 0),
                duration_days=data.get('duration_days', 30),
                limits_json=data.get('limits_json', {}),
                is_default=data.get('is_default', False),
                is_recommended=data.get('is_recommended', False),
                is_active=data.get('is_active', True)
            )
            return json_response(data={'id': plan.id}, message="Pricing plan created successfully")
        except Product.DoesNotExist:
            return json_response(success=False, message="Product not found", status=404)
        except Exception as e:
            return json_response(success=False, message=str(e), status=400)

@method_decorator(csrf_exempt, name='dispatch')
class PricingPlanDetailView(View):
    def put(self, request, plan_id):
        try:
            plan = PricingPlan.objects.get(id=plan_id)
            data = json.loads(request.body)
            
            if 'product_id' in data:
                plan.product = Product.objects.get(id=data['product_id'])
            
            plan.name = data.get('name', plan.name)
            plan.billing_cycle = data.get('billing_cycle', plan.billing_cycle)
            plan.price = data.get('price', plan.price)
            plan.currency = data.get('currency', plan.currency)
            plan.discount_percent = data.get('discount_percent', plan.discount_percent)
            plan.duration_days = data.get('duration_days', plan.duration_days)
            plan.limits_json = data.get('limits_json', plan.limits_json)
            plan.is_default = data.get('is_default', plan.is_default)
            plan.is_recommended = data.get('is_recommended', plan.is_recommended)
            plan.is_active = data.get('is_active', plan.is_active)
            plan.save()
            
            return json_response(message="Pricing plan updated successfully")
        except PricingPlan.DoesNotExist:
            return json_response(success=False, message="Pricing plan not found", status=404)
        except Exception as e:
            return json_response(success=False, message=str(e), status=400)

@csrf_exempt
def toggle_plan_status(request, plan_id):
    if request.method == 'PATCH':
        try:
            plan = PricingPlan.objects.get(id=plan_id)
            plan.is_active = not plan.is_active
            plan.save()
            return json_response(message=f"Plan {'activated' if plan.is_active else 'deactivated'}")
        except PricingPlan.DoesNotExist:
            return json_response(success=False, message="Plan not found", status=404)
        except Exception as e:
            return json_response(success=False, message=str(e), status=500)

@csrf_exempt
def set_default_plan(request, plan_id):
    if request.method == 'PATCH':
        try:
            plan = PricingPlan.objects.get(id=plan_id)
            # Remove default from other plans of the same product
            PricingPlan.objects.filter(product=plan.product).update(is_default=False)
            plan.is_default = True
            plan.save()
            return json_response(message="Default plan updated")
        except PricingPlan.DoesNotExist:
            return json_response(success=False, message="Plan not found", status=404)
        except Exception as e:
            return json_response(success=False, message=str(e), status=500)

# Student-facing views
def student_pricing_plans(request):
    try:
        plans = PricingPlan.objects.select_related('product').filter(
            is_active=True,
            product__is_active=True,
            product__audience_role='student'
        ).order_by('price')
        
        data = []
        for plan in plans:
            data.append({
                'id': plan.id,
                'name': plan.name,
                'product': {
                    'id': plan.product.id,
                    'name': plan.product.name,
                    'description': plan.product.description,
                    'features_json': plan.product.features_json,
                },
                'billing_cycle': plan.billing_cycle,
                'price': float(plan.price),
                'currency': plan.currency,
                'discount_percent': float(plan.discount_percent),
                'duration_days': plan.duration_days,
                'limits_json': plan.limits_json,
                'is_recommended': plan.is_recommended,
                'is_active': plan.is_active,
            })
        return json_response(data=data)
    except Exception as e:
        return json_response(success=False, message=str(e), status=500)

def student_subscription(request):
    try:
        # This would typically get user_id from session/auth
        user_id = request.GET.get('user_id', 1)  # Mock for now
        
        subscription = UserSubscription.objects.select_related('plan__product').filter(
            user_id=user_id,
            user_type='student',
            status='active'
        ).first()
        
        if subscription:
            data = {
                'id': subscription.id,
                'plan': {
                    'id': subscription.plan.id,
                    'name': subscription.plan.name,
                    'product': {
                        'name': subscription.plan.product.name,
                    },
                    'price': float(subscription.plan.price),
                    'currency': subscription.plan.currency,
                    'discount_percent': float(subscription.plan.discount_percent),
                },
                'start_date': subscription.start_date.isoformat(),
                'end_date': subscription.end_date.isoformat(),
                'status': subscription.status,
            }
            return json_response(data=data)
        else:
            return json_response(data=None, message="No active subscription found")
    except Exception as e:
        return json_response(success=False, message=str(e), status=500)

@csrf_exempt
def upgrade_plan(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            plan_id = data['plan_id']
            user_id = data.get('user_id', 1)  # Mock for now
            
            plan = PricingPlan.objects.get(id=plan_id)
            
            # Create subscription (in real app, this would integrate with payment gateway)
            subscription = UserSubscription.objects.create(
                user_id=user_id,
                user_type='student',
                plan=plan,
                start_date=datetime.now(),
                end_date=datetime.now() + timedelta(days=plan.duration_days),
                status='active'
            )
            
            return json_response(
                data={'subscription_id': subscription.id, 'payment_url': '/payment'},
                message="Plan upgrade initiated"
            )
        except PricingPlan.DoesNotExist:
            return json_response(success=False, message="Plan not found", status=404)
        except Exception as e:
            return json_response(success=False, message=str(e), status=400)