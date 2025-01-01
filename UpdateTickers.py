# -*- coding: utf-8 -*-
"""
Created on Tue Dec 31 07:31:29 2024

@author: wrone
"""

import logging
from datetime import datetime
from selenium import webdriver
from bs4 import BeautifulSoup

logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)
spammers = ['selenium.webdriver.remote.remote_connection',
            'selenium.webdriver.common.selenium_manager',
            'selenium.webdriver.common.service',
            'urllib3.connectionpool']
for spammer in spammers:
    spamlogger = logging.getLogger(spammer)
    spamlogger.setLevel(logging.WARNING)

class UpdateTickers():
    def __init__(self, fdb):
        self.fdb = fdb
        self.__updateTickers()
    def __updateTickers(self):
        logger.info('Updating tickers starting....')
        today = datetime.today()
        logger.info(f'Today: {today}')
        cusips = set()
        for spot in self.fdb.G.predecessors('Position'):
            decomp = spot.split(':')
            what = decomp[1]
            if what[0] != '$' and what != 'nan':
                cusips.add(what)
        logger.info(f'CUSIPS: {cusips}')
        BASEPATH = 'C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\'
        opts = webdriver.ChromeOptions()
        opts.binary_location = f'{BASEPATH}brave.exe'
#        driverpath = f'{BASEPATH}chromedriver.exe'
        opts.page_load_strategy='eager'
        
        driver = webdriver.Chrome(options=opts)
        for cusip in cusips:
            self.getTicker(driver, cusip)
        driver.quit()
        logger.info('Updating tickers done.')
        return
    def getTicker(self, driver, cusip):
        logger.info(f'Getting Info for {cusip}')
        uri = f'https://finance.yahoo.com/quote/{cusip}/history/'
        driver.get(uri)
        soup = BeautifulSoup(driver.page_source, "html.parser")
        table = soup.find("table")
        if table is not None:
            body = table.find("tbody")
            if body is not None:
                rows = body.find_all("tr")
                if rows is not None:
                    self.fdb.addNode(cusip, 'MarketTicker')
                    prevM = None
                    for row in rows:
                        td = row.find_all("td")
                        tdate = td[0].get_text()
                        try:
                            dt = datetime.strptime(tdate, '%b %d, %Y')
                            if dt.month != prevM and len(td) == 7:
                                closemonth=dt.strftime('%B-%Y')
                                close = td[4].get_text()
                                logger.debug(f'{cusip} on {closemonth} was {close}')
                                self.fdb.addNode(cusip, 'MarketTicker')
                                self.fdb.addNode(closemonth, 'CloseMonth')
                                self.fdb.addLinkage(close, 'ClosePrice', cusip)
                                self.fdb.addLinkage(close, 'ClosePrice', closemonth)
                                prevM = dt.month
                        except:
                            logger.error(f'Format of {tdate}')
                else:
                    logger.info('no rows')
            else:
                logger.info('no tbody')
        else:
            logger.info('no table')
        return
        