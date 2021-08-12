# import csv

# with open('HCFPaises.csv', newline='') as csvfile:
#     data = list(csv.reader(csvfile))

#     print(data[0][1] + data[1][1])

#     nome = "gabriel"

#     print(nome[0])

# # print(data)


# def padronizaNomeAutor(nome):
#     nomeFinal = ""
#     for i in range(0, len(nome)):
#         if (nome[i] != '(' and nome[i] != ')'):
#             if (nome[i] == '&'):
#                 nomeFinal += " & "
#             elif (ord(nome[i]) >= 65 and ord(nome[i]) <= 90): # é maiusculo
#                 if (i + 1 < len(nome)):
#                     if (nome[i + 1] == '&'):
#                         nomeFinal += nome[i] + ". "
#                     elif (ord(nome[i + 1]) >= 65 and ord(nome[i + 1]) <= 90):
#                         nomeFinal += nome[i] + ". "
#                     elif (i - 1 >= 0 and ord(nome[i - 1]) >= 97 and ord(nome[i - 1]) <= 122):
#                         nomeFinal += " " + nome[i]
#                     else :
#                         nomeFinal += nome[i]
#             else:
#                 nomeFinal += nome[i]
#         else:
#             nomeFinal += nome[i]
#     return nomeFinal

# print(padronizaNomeAutor('Hitch. & Chase'))

def getIniciaisAutores(nome) :
    iniciais = ""
    for i in range(0, len(nome)):
        if (nome[i] == '&'):
            iniciais += " & "
        elif (ord(nome[i]) >= 65 and ord(nome[i]) <= 90): # é maiusculo
            iniciais += nome[i] + "."
    return iniciais

print(getIniciaisAutores('Hitch. & Chase'))