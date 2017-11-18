#!/usr/bin/env python
# -*- coding: utf-8 -*-
import csv
import sys

def main(path):
    with open(path, 'rb') as f:
        reader = csv.reader(f)
        next(reader, None)
        for row in reader:
            print row[0]

if __name__ == '__main__':
    main(sys.argv[1])

