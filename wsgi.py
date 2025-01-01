import logging, waitress, hupper, prometheus_flask_exporter, prometheus_client, werkzeug.middleware.dispatcher 
from flask import Flask, render_template, send_file, request
import os, json
import FinancialDatabase
import UpdateTickers

logging.basicConfig(format='<%(name)s> %(asctime)s %(filename)s:%(lineno)d:%(funcName)s => %(levelname)s:%(message)s', datefmt='%m/%d/%Y %I:%M:%S %p', level=logging.DEBUG)

TEMPLATE_PATH='templates'
DATA_PATH='c:\\Users\\wrone\\OneDrive\\FinDox\\FinDox.xlsm'
app = Flask('LocalFinances', template_folder=TEMPLATE_PATH)
app.secret_key='oh boy'
app.GDB = FinancialDatabase.FinancialDatabase().load(DATA_PATH)
app.logger = logging.getLogger(__name__)
app.logger.setLevel(logging.DEBUG)
app.wsgi_app = werkzeug.middleware.dispatcher.DispatcherMiddleware(app.wsgi_app, {
    '/metrics': prometheus_client.make_wsgi_app()
})
metrics = prometheus_flask_exporter.PrometheusMetrics(app)
metrics.info('LocalFinance', 'DIM', version='0.0.1')

def list_panels(path):
    return os.listdir(os.path.join(TEMPLATE_PATH,path))

app.jinja_env.globals.update(list_panels=list_panels)

@app.route('/update')
def update():
    UpdateTickers.UpdateTickers(app.GDB)
    return f'{app.GDB}'

@app.route('/reload')
def reload():
    app.GDB.load(DATA_PATH);
    return f'{app.GDB}'

@app.route('/data')
def query():
    return app.response_class(
        response=json.dumps(app.GDB.query(request.args)),
        status=200,
        mimetype='application/json'
    )

@app.route('/datadict')
def datadict():
    return f'<img src="data:image/svg;base64,{app.GDB.visualize()}">'

@app.route('/', defaults={'path': 'index.html'})
@app.route('/<path:path>')
def root(path):
    ext = os.path.splitext(path)
    if ext[1] == '.html':
        return render_template(path)
    else:
        return send_file(os.path.join('templates', path))
    
def run_server():
    app.logger.info('run_server()')
    host = 'localhost'
    port = 5001
    app.debug=True
#    if app.GDB.isEmpty():
#        app.GDB.initialize()
#        app.GDB.save()
#    else:
#        app.logger.debug(f'{app.GDB}')
    app.logger.debug(f'{app.GDB}')
    app.logger.info('Pre-start updating market prices!')
    with app.test_request_context('/update', method='GET'):
        app.logger.info(f'{update()}')
    app.logger.info('Starting WSGI, ready to test!')
    
    waitress.serve(app, host=host, port=port, threads=10)
    
if __name__ == '__main__':
    hupper.start_reloader('wsgi.run_server', ignore_files=[r'(.*)\.pyd'])
    
