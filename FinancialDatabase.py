# -*- coding: utf-8 -*-
"""
Created on Fri Dec 20 15:17:10 2024

@author: wrone
"""

import logging, pandas, math
from datetime import datetime
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)
spammers = []
for spammer in spammers:
    spamlogger = logging.getLogger(spammer)
    spamlogger.setLevel(logging.WARNING)

import GraphDatabase

GDBFile = 'database/fullgraph.gml'

class FinancialDatabase(GraphDatabase.GraphDatabase):
    def __init__(self):
        super().__init__()
    def initialize(self):
        logger.info('Initializing fresh FinancialDatabase')
        self.addNode('Savings', 'AccountType')
        self.addNode('Checking', 'AccountType')
        self.addNode('Investment', 'AccountType')
        self.addNode('Pension', 'AccountType')
        self.addNode('Retirement (WNR)', 'AccountType')
        self.addNode('Retirement (ARR)', 'AccountType')
        self.addNode('Education', 'AccountType')
        self.addNode('Vesting', 'AccountType')
        self.addNode('Deferred Comp (WNR)', 'AccountType')
        return
    def load(self, fname=None):
        if fname is None:
            raise ValueError('FinancialDatabase.load requires a filename to an xlsx.')
            return super().load(GDBFile)
        return self.loadXLSX(fname);
    def save(self):
        return super().save(GDBFile)
    def query(self, args):
        logger.info(f'Query is {args["whatIwant"]}')
        func = getattr(self, args['whatIwant'], None)
        if (func is not None) and callable(func):
            return func(args)
        else:
            return args
    def currentValue(self, args):
        res = {'CurrentValue': 0}
        month = datetime.today().strftime('%B')
        year = datetime.today().strftime('%Y')
        logger.info(f'Looking for SpotBalance on {month}-{year}')
        logger.info(f'Looking for accountPre {list(self.G.predecessors("Account"))}')
        logger.info(f'Looking for accountSuc {list(self.G.successors("Account"))}')
#        return super().query() \
#                    .getAllFrom(self.G.predecessors('Account'))
        return super().query() \
                    .getAllFrom('December-2024')
    def yearValueHistory(self, args):
        res = {'YearValueHistory': 0}
        return res
    def AccountTypeList(self, args):
        logger.info('Running AccountTypeList')
        return super().query().include('AccountType').fetch()
    def loadXLSX(self, fname):
        worksheets = pandas.read_excel(fname, sheet_name=None, header=None)
        for worksheet in worksheets.keys():
            if worksheet not in ['Current View','Market Prices']:
                self.__loadAccount(worksheets[worksheet])
        return self
    def __loadMarketPrices(self, df):
        logger.info(f'Loading Market Prices [{df.shape}]')
        # first 2 rows are simple headers.  Row 1 is the year (ignore) and Row 2 is the month (algorithm)
        for row in range(2,df.shape[0]):
            ticker = df[df.columns[0]].loc[row]
            if ticker != 'nan':
                self.addNode(ticker, 'MarketTicker')
                for col in range(1, df.shape[1]):
                    month = df[df.columns[col]].loc[1]
                    year = df[df.columns[1+12*(math.trunc((col-1)/12))]].loc[0]
                    price = df[df.columns[col]].loc[row]
                    self.addNode(f'{month}-{year}', 'When')
                    self.addLinkage(f'{month}-{year}:{price}', 'SpotPrice', ticker)
                    self.addLinkage(f'{month}-{year}:{price}', 'SpotPrice', f'{month}-{year}')
        return self
    def __loadAccount(self, df):
        logger.info(f'Loading Account Data [{df.shape}]')
        AcctType= df[df.columns[1]].loc[0]
        AcctBank= df[df.columns[1]].loc[1]
        AcctNumber= df[df.columns[1]].loc[2]
        self.addNode(f'{AcctNumber}', 'Account')
        self.addLinkage(f'{AcctBank}', 'Bank', f'{AcctNumber}')
        self.addLinkage(f'{AcctType}', 'AccountType', f'{AcctNumber}')
        for row in range(6 ,df.shape[0]):
            month = df[df.columns[0]].loc[row]
            year = df[df.columns[1]].loc[row]
            self.addNode(f'{month}-{year}', 'CloseMonth')
            for col in range(2,df.shape[1]):
                holding = df[df.columns[col]].loc[row]
                ticker = df[df.columns[col]].loc[5] 
                if f'{holding}' != 'nan':
                    self.addLinkage(f'{ticker}', 'MarketTicker', f'{AcctNumber}')
                    self.addLinkage(f'{month}-{year}:{ticker}:{holding}', 'PositionAcct', f'{AcctNumber}')
                    self.addLinkage(f'{month}-{year}:{ticker}:{holding}', 'Position', f'{ticker}')
                    self.addLinkage(f'{month}-{year}:{ticker}:{holding}', 'PositionClose', f'{month}-{year}')
            
        return self
