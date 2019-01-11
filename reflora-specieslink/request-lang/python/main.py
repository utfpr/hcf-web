import urllib2, json;

def main():
    for x in range(1, 300):
        if(x < 10):
            num_barra = str(x)
            num_barra = '00' + str(x)
        elif(x < 100):
            num_barra = str(x)
            num_barra = '0' + str(x)
        else:
            num_barra = str(x)
        num_barra = 'HCF000000' + num_barra
        request = 'http://servicos.jbrj.gov.br/v2/herbarium/' + num_barra
        contents = urllib2.urlopen(request).read()
        jsondata = json.loads(contents)
        #print(jsondata['result'][0]['rightsholder'] == 'HCF')
        if(jsondata['success'] == True):
            if(jsondata['result'][0]['rightsholder']):
                print(request)

if __name__ == '__main__':
    main()