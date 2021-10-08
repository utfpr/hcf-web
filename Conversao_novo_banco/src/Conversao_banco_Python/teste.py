import re
coletor = '; G.R. Silva: S. Vieira & M.Montanha'
print(coletor)

coletorSplit = re.split('[&|;|:|,]', coletor)
# coletorSplit = []
# coletorSplit.append(coletor.split('&')[0])
# latitudeSplit.append(latitude.split('°')[1].split("'")[0])
# latitudeSplit.append(latitude.split('°')[1].split("'")[1].split('"')[0])
# latitudeSplit.append(latitude.split('°')[1].split("'")[1].split('"')[1].strip())


# latitude = latitude.replace("\'\'","\"")
# latitudeSplit = []
# latitudeSplit.append(latitude.split('°')[0])
# latitudeSplit.append(latitude.split('°')[1].split("'")[0])
# latitudeSplit.append(latitude.split('°')[1].split("'")[1].split('"')[0])
# latitudeSplit.append(latitude.split('°')[1].split("'")[1].split('"')[1].strip())

print(coletorSplit)

# 48°24'20" N
# altitude = '135M'

# print(int(re.sub('[^0-9]', '', altitude)))