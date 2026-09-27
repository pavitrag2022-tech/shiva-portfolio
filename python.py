# class BankAccount:
#     def __init__(self,name,id,balance):
#         self.name=name
#         self.id=id
#         self.balance=balance
#     def deposit(self,amount):
#         self.balance+=amount
#     def withdraw(self,amount):
#         if self.balance>=amount:
#             self.balance-=amount
#         else:
#             print("Insufficient balance") 
# account1=BankAccount("Pavitra",12345,1000)   
# print(account1.balance)            
# account1.withdraw(500)
# print(account1.balance)

# a=10
# b=20
# c=a+b
# print(c)
# d=c+a
# print(d)

# class A:
#     def __init__(self):
#         self.a=10
# class B(A):
#     def __init__(self):
#         super().__init__()
#         self.b=20        
# class C(B):
#     def __init__(self):
#         super().__init__()
#         self.c=30
# cf= C()
# print(cf.a)  # Output: 10
# print(cf.b)  # Output: 20
# print(cf.c)  # Output: 30

a=[10,20,30,40,50]
a1=a.copy()
print(a)
print(a1)
del a1[2]
print(a)
print(a1)
