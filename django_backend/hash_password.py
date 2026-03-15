import bcrypt

password = "123456789"
hashed = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())
print(hashed.decode())
