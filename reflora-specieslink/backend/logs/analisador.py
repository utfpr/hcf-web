import sys

def main(fileName):
    if '.log' in fileName:
        file = open(fileName, "r")
        
        lines = file.readlines()
        
        countLines = len(lines)
        aplicacao = ''
        countCodBarra = 0
        countHasNotResult = 0
        countHasResult = 0
        hasNotResult = []
        countError = 0
        hasError = []
        countNotRequest = 0
        hasNotRequest = []
        doRequest = 0
        valueRequest = []
        nroColetaEqual = 0
        nroColetaNotEqual = 0
        nroColetaNotNumber = 0
        nroColetaNull = 0
        dayColetaEqual = 0
        dayColetaNotEqual = 0
        dayColetaNotNumber = 0
        dayColetaNull = 0
        monthColetaEqual = 0
        monthColetaNotEqual = 0
        monthColetaNotNumber = 0
        monthColetaNull = 0
        yearColetaEqual = 0
        yearColetaNotEqual = 0
        yearColetaNotNumber = 0
        yearColetaNull = 0
        altitudeEqual = 0
        altitudeNotEqual = 0
        altitudeNotNumber = 0
        altitudeNull = 0
        latitudeEqual = 0
        latitudeNotEqual = 0
        latitudeNotNumber = 0
        latitudeNull = 0
        longitudeEqual = 0
        longitudeNotEqual = 0
        longitudeNotNumber = 0
        longitudeNull = 0
        dateIdentifiedEqual = 0
        dateIdentifiedNotEqual = 0
        nomeCientificoEqual = 0
        nomeCientificoNotEqual = 0

        for line in lines:
            result = line.encode('cp1252').decode('utf-8')

            if 'Inicializando a aplicação do' in result:
                aplicacao = line[line.index('{') + 1: line.rfind('}')]

            if 'Todos os códigos de barras' in result:
                countCodBarra = line[line.index('{') + 1: line.rfind('}')]
            
            if 'possui um resultado no Reflora' in result:
                if 'não' in result:
                    countHasNotResult = countHasNotResult + 1
                    hasNotResult.append(line[line.index('{') + 1: line.rfind('}')])
                else:
                    countHasResult = countHasResult + 1
            
            if 'Realizando a requisição do código de barra' in result:
                doRequest = doRequest + 1
                newCodBarra = line[line.index('{') + 1: line.rfind('}')]
                newCodBarra = newCodBarra.replace('HCF', '')
                valueRequest.append(int(newCodBarra))
                
            if 'Erro no código de barra' in result:
                countError = countError + 1
                hasError.append(line[line.index('{') + 1: line.rfind('}')])
            
            if 'Não foi feita a requisição do código de barra' in  result:
                countNotRequest = countNotRequest + 1
                hasNotRequest.append(line[line.index('{') + 1: line.rfind('}')])

            if 'números de coletas são iguais' in result:
                nroColetaEqual = nroColetaEqual + 1

            if 'números de coletas são diferentes' in result:
                nroColetaNotEqual = nroColetaNotEqual + 1

            if 'números de coletas não são números' in result:
                nroColetaNotNumber = nroColetaNotNumber + 1

            if 'números de coletas são nulos' in result:
                nroColetaNull = nroColetaNull + 1

            if 'dias de coletas são iguais' in result:
                dayColetaEqual = dayColetaEqual + 1

            if 'dias de coletas são diferentes' in result:
                dayColetaNotEqual = dayColetaNotEqual + 1

            if 'dias de coletas não são números' in result:
                dayColetaNotNumber = dayColetaNotNumber + 1

            if 'dias de coletas são nulos' in result:
                dayColetaNull = dayColetaNull + 1

            if 'mês da coletas são iguais' in result: 
                monthColetaEqual = monthColetaEqual + 1

            if 'mês da coletas são diferentes' in result:
                monthColetaNotEqual = monthColetaNotEqual + 1

            if 'mês da coletas não são números' in result:
                monthColetaNotNumber = monthColetaNotNumber + 1

            if 'mês da coletas são nulos' in result:
                monthColetaNull = monthColetaNull + 1

            if 'anos de coleta são iguais' in result:
                yearColetaEqual = yearColetaEqual + 1

            if 'anos de coleta são diferentes' in result: 
                yearColetaNotEqual = yearColetaNotEqual + 1

            if 'anos de coleta não são números' in result:
                yearColetaNotNumber = yearColetaNotNumber + 1

            if 'anos de coleta são nulos' in result:
                yearColetaNull = yearColetaNull + 1

            if 'altitudes são iguais' in result:
                altitudeEqual = altitudeEqual + 1

            if 'altitudes são diferentes' in result:
                altitudeNotEqual = altitudeNotEqual + 1

            if 'altitudes não são números' in result:
                altitudeNotNumber = altitudeNotNumber + 1

            if 'altitudes são nulos' in result:
                altitudeNull = altitudeNull + 1

            if 'latitudes são iguais' in result:
                latitudeEqual = latitudeEqual + 1

            if 'latitudes são diferentes' in result:
                latitudeNotEqual = latitudeNotEqual + 1

            if 'latitudes não são números' in result:
                latitudeNotNumber = latitudeNotNumber + 1

            if 'latitudes são nulos' in result:
                latitudeNull = latitudeNull + 1

            if 'longitudes são iguais' in result:
                longitudeEqual = longitudeEqual + 1

            if 'longitudes são diferentes' in result:
                longitudeNotEqual = longitudeNotEqual + 1

            if 'longitudes não são números' in result:
                longitudeNotNumber = longitudeNotNumber + 1

            if 'longitudes são nulos' in result:
                longitudeNull = longitudeNull + 1

            if 'datas de identificação são iguais' in result: 
                dateIdentifiedEqual = dateIdentifiedEqual + 1

            if 'datas de identificação são diferentes' in result:
                dateIdentifiedNotEqual = dateIdentifiedNotEqual + 1

            if 'nomes científicos são iguais' in result:
                nomeCientificoEqual = nomeCientificoEqual + 1

            if 'nomes científicos são diferentes' in result:
                nomeCientificoNotEqual = nomeCientificoNotEqual + 1

        print('A quantidade de linhas é: ' + str(countLines))
        print('A aplicação é: ' + str(aplicacao))
        print('A quantidade de código de barras é: ' + str(countCodBarra))
        print('A quantidade de código de barras com resultado é: ' + str(countHasResult))
        print('A quantidade de código de barras sem resultado é: ' + str(countHasNotResult))
        # print('Os códigos de barras sem resultado são: ' + str(hasNotResult))
        print('A quantidade de código de barras com erro é: ' + str(countError))
        # print('Os códigos de barras com erro são: ' + str(hasError))
        print('A quantidade de código de barras sem requisição é: ' + str(countNotRequest))
        # print('Os códigos de barras sem requisição são: ' + str(hasNotRequest))
        print('===================================================================================')
        print('A quantidade de número de coleta igual é: ' + str(nroColetaEqual))
        print('A quantidade de número de coleta diferente é: ' + str(nroColetaNotEqual))
        print('A quantidade de número de coleta que não são números são: ' + str(nroColetaNotNumber))
        print('A quantidade de número de coleta que não são nulos: ' + str(nroColetaNull))
        print('===================================================================================')
        print('A quantidade de dia de coleta igual é: ' + str(dayColetaEqual))
        print('A quantidade de dia de coleta diferente é: ' + str(dayColetaNotEqual))
        print('A quantidade de dia de coleta que não são números são: ' + str(dayColetaNotNumber))
        print('A quantidade de dia de coleta que não são nulos: ' + str(dayColetaNull))
        print('===================================================================================')
        print('A quantidade de mês de coleta igual é: ' + str(monthColetaEqual))
        print('A quantidade de mês de coleta diferente é: ' + str(monthColetaNotEqual))
        print('A quantidade de mês de coleta que não são números são: ' + str(monthColetaNotNumber))
        print('A quantidade de mês de coleta que não são nulos: ' + str(monthColetaNull))
        print('===================================================================================')
        print('A quantidade de ano de coleta igual é: ' + str(yearColetaEqual))
        print('A quantidade de ano de coleta diferente é: ' + str(yearColetaNotEqual))
        print('A quantidade de ano de coleta que não são números são: ' + str(yearColetaNotNumber))
        print('A quantidade de ano de coleta que não são nulos: ' + str(yearColetaNull))
        print('===================================================================================')
        print('A quantidade de altitude igual é: ' + str(altitudeEqual))
        print('A quantidade de altitude diferente é: ' + str(altitudeNotEqual))
        print('A quantidade de altitude que não são números são: ' + str(altitudeNotNumber))
        print('A quantidade de altitude que não são nulos: ' + str(altitudeNull))
        print('===================================================================================')
        print('A quantidade de latitude igual é: ' + str(latitudeEqual))
        print('A quantidade de latitude diferente é: ' + str(latitudeNotEqual))
        print('A quantidade de latitude que não são números são: ' + str(latitudeNotNumber))
        print('A quantidade de latitude que não são nulos: ' + str(latitudeNull))
        print('===================================================================================')
        print('A quantidade de longitude igual é: ' + str(longitudeEqual))
        print('A quantidade de longitude diferente é: ' + str(longitudeNotEqual))
        print('A quantidade de longitude que não são números são: ' + str(longitudeNotNumber))
        print('A quantidade de longitude que não são nulos: ' + str(longitudeNull))
        print('===================================================================================')
        print('A quantidade de data de identificação que são iguais: ' + str(dateIdentifiedEqual))
        print('A quantidade de data de identificação que não são iguais: ' + str(dateIdentifiedNotEqual))
        print('===================================================================================')
        print('A quantidade de nome científico que são iguais: ' + str(nomeCientificoEqual))
        print('A quantidade de nome científico que não são iguais: ' + str(nomeCientificoNotEqual))
        
        # valueRequest = sorted(valueRequest)
        valoresFaltantes = []

        for i in range(1, int(countCodBarra)):
            existe = False
            for value in valueRequest:
                if value == i:
                    existe = True
                    break
            if not existe:
                valoresFaltantes.append(i)
        
        print('===================================================================================')
        print('A quantidade de requisição é: ' + str(doRequest))
        print('A quantidade de requisição que faltaram é: ' + str(len(valoresFaltantes)))

        # close the file after reading the lines.
        file.close()
    else:
        print('Arquivo inesperado')

if __name__ == '__main__':
    main(sys.argv[1])
