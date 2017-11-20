#!/usr/bin/env python
# -*- coding: utf-8 -*-
import csv
import sys

#['lengua y traducctor', 'id_t\xc3\xadtulo', 't\xc3\xadtulo', 'anio primer edici\xc3\xb3n', 'editorial1b 1', 'editorial1b 2', 'editorial1b 3', 'editorial1b 4', 'editorial1b 5', 'editorial1b 6', 'editorial2b', 'ciudad_ed', 'pa\xc3\xads_ed', 'lengua o idioma', 'g\xc3\xa9nero', 'g\xc3\xa9nero2']

def main(path):
    with open(path, 'rb') as f:
        reader = csv.reader(f)
        header = next(reader, None)
        print header
        for row in reader:
            pass
            print row[3]

if __name__ == '__main__':
    main(sys.argv[1])

