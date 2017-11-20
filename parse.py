#!/usr/bin/env python
# -*- coding: utf-8 -*-
import csv
import sys
import io, json


#['lengua y traducctor', 'id_t\xc3\xadtulo', 't\xc3\xadtulo', 'anio primer edici\xc3\xb3n', 'editorial1b 1', 'editorial1b 2', 'editorial1b 3', 'editorial1b 4', 'editorial1b 5', 'editorial1b 6', 'editorial2b', 'ciudad_ed', 'pa\xc3\xads_ed', 'lengua o idioma', 'g\xc3\xa9nero', 'g\xc3\xa9nero2']

def main(path):
    data = []
    with open(path, 'rt', encoding='utf-8') as f:
        reader = csv.reader(f)
        header = next(reader, None)
        print(header)
        for row in reader:
            book = {}
            book['year'] = row[3]
            book['city'] = row[11]
            book['country'] = row[12]
            book['language'] = row[13]
            book['genre'] = row[14]
            data.append(book)

    json_path = '%s.json' % path.split('.')[0]
    
    with io.open(json_path, 'w', encoding='utf-8') as f:
        f.write(json.dumps(data, indent=4, ensure_ascii=False))
    

if __name__ == '__main__':
    main(sys.argv[1])

