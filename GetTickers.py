# -*- coding: utf-8 -*-
"""
Created on Mon Dec 30 19:41:53 2024

@author: wrone
"""
from datetime import datetime
from selenium import webdriver
from bs4 import BeautifulSoup

EOM2024=['Dec 30, 2024',
         'Nov 29, 2024',
         'Oct 31, 2024',
         'Sep 30, 2024',
         'Aug 30, 2024',
         'Jul 31, 2024',
         'Jun 28, 2024',
         'May 31, 2024',
         'Apr 30, 2024',
         'Mar 28, 2024',
         'Feb 29, 2024',
         'Jan 31, 2024',
         ]

def lookup(driver, cusip):
    spotDate = datetime.today()
    uri = f'https://finance.yahoo.com/quote/{cusip}/history/'
    driver.get(uri)
    soup = BeautifulSoup(driver.page_source, "html.parser")
    table = soup.find("table")
    body = table.find("tbody")
    rows = body.find_all("tr")
    for row in rows:
        td = row.find_all("td")
        tdate = td[0].get_text()
        if tdate in EOM2024 and len(td) == 7:
            close = td[4].get_text()
            print(f'{cusip} on {tdate} was {close}')
    return

BASEPATH = 'C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\'
options = webdriver.ChromeOptions()
options.binary_location = f'{BASEPATH}brave.exe'

driver = webdriver.Chrome(f'{BASEPATH}chromedriver.exe',chrome_options=options)

for cusip in ['ALC', 'AXP','BAC','CVX','XOM','GE','GEHC','GEV','JPM','NVS','PEP','PG','SDZNY','WAB','KO','MRK','OGN','CI','ANCFX','AMECX','FTSL','RSP','NOBL','DGFAX',]:
    
    print(f'Getting {cusip}')
    lookup(driver, cusip)

driver.quit()
print('Done!')    
    