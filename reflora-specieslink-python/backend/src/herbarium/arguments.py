import sys, verbose

def checkArguments(argv):
    if len(argv) == 2:
        # colocar or --verbose
        if argv[1] == '-v' or argv[1] == '--verbose':
            verbose.startVerbose()
        elif argv[1] == '-h' or argv[1] == '--help':
            print('-h or --help, Show this text')
            print('-t or --test, Show this text')
            print('-v or --verbose, Show operations')
            sys.exit(0)
    elif len(argv) > 2:
        ''' aqui vai estar relacionado a periodicidade '''
        print('b')