import React, { useEffect, useState } from "react";
import { useLocation } from "wouter";

export default function StudentPaymentStatus() {
  const [, navigate] = useLocation();

  const [status, setStatus] = useState<string | null>(null);
  const [payment, setPayment] = useState<any>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const statusParam = params.get("status");
    setStatus(statusParam);

    const raw = localStorage.getItem("last_payment");
    if (raw) setPayment(JSON.parse(raw));
  }, []);

  useEffect(() => {
    if (status === "success" && payment) {
      const rawInvoices = localStorage.getItem("student_invoices");
      const invoices = rawInvoices ? JSON.parse(rawInvoices) : [];

      const newInvoice = {
        invoiceId: "INV" + Math.floor(10000 + Math.random() * 90000),
        paymentId: payment.paymentId,
        planId: payment.planId,
        planName: payment.planId?.charAt(0).toUpperCase() + payment.planId?.slice(1) + " Plan",
        amount: payment.amount,
        method: payment.method,
        status: "paid",
        createdAt: payment.createdAt,
      };

      invoices.unshift(newInvoice);
      localStorage.setItem("student_invoices", JSON.stringify(invoices));
    }
  }, [status, payment]);

  if (!status) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-lg font-semibold">
        Loading...
      </div>
    );
  }

  const isSuccess = status === "success";

  return (
    <div className="w-full min-h-[75vh] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div
          className={`p-8 text-center ${
            isSuccess ? "bg-gradient-to-r from-purple-600 to-indigo-600" : "bg-gradient-to-r from-red-500 to-pink-600"
          }`}
        >
          <div className="text-6xl mb-4">
            {isSuccess ? "🎉" : "❌"}
          </div>

          <h1 className="text-3xl font-extrabold text-white">
            {isSuccess ? "Payment Successful" : "Payment Failed"}
          </h1>

          <p className="text-white/90 mt-2 text-base">
            {isSuccess
              ? "Your payment was completed successfully. You can now access premium features."
              : "Your payment could not be completed. Please try again or choose another plan."}
          </p>
        </div>

        {/* Body */}
        <div className="p-8">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-gray-200 p-4">
              <p className="text-sm text-gray-500">Payment ID</p>
              <p className="font-bold text-gray-900 text-lg">{payment?.paymentId || "N/A"}</p>
            </div>

            <div className="rounded-2xl border border-gray-200 p-4">
              <p className="text-sm text-gray-500">Plan</p>
              <p className="font-bold text-gray-900 text-lg">{payment?.planId?.charAt(0).toUpperCase() + payment?.planId?.slice(1) || "N/A"}</p>
            </div>

            <div className="rounded-2xl border border-gray-200 p-4">
              <p className="text-sm text-gray-500">Amount</p>
              <p className="font-bold text-gray-900 text-lg">₹{payment?.amount || 0}</p>
            </div>

            <div className="rounded-2xl border border-gray-200 p-4">
              <p className="text-sm text-gray-500">Payment Method</p>
              <p className="font-bold text-gray-900 text-lg">{payment?.method || "N/A"}</p>
            </div>
          </div>

          {/* Extra info */}
          <div className="mt-6 rounded-2xl bg-gray-50 border border-gray-200 p-4">
            <p className="text-gray-700 text-sm leading-relaxed">
              {isSuccess ? (
                <>
                  ✅ Your subscription is now active.
                  <br />
                  You can view your invoice anytime from <b>My Invoices</b>.
                </>
              ) : (
                <>
                  ⚠️ Payment did not go through.
                  <br />
                  Retry the payment or select a different plan.
                </>
              )}
            </p>
          </div>

          {/* Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            {isSuccess ? (
              <>
                <button
                  onClick={() => navigate("/dashboard")}
                  className="px-6 py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold shadow-md transition"
                >
                  Go to Dashboard
                </button>

                <button
                  onClick={() => navigate("/my-invoices")}
                  className="px-6 py-3 rounded-2xl border-2 border-purple-600 text-purple-700 font-bold hover:bg-purple-50 transition"
                >
                  View Invoices
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate(`/student/checkout/${payment?.planId || "basic"}`)}
                  className="px-6 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold shadow-md transition"
                >
                  Retry Payment
                </button>

                <button
                  onClick={() => navigate("/student/plans")}
                  className="px-6 py-3 rounded-2xl border-2 border-red-600 text-red-700 font-bold hover:bg-red-50 transition"
                >
                  Change Plan
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}