
from flask import Flask,request,jsonify
from flask_sqlalchemy import SQLAlchemy
from flask import render_template
from flask_cors import CORS,cross_origin

database_url = "postgresql://postgres:1234@localhost:5432/db"

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = database_url
db = SQLAlchemy(app)
CORS(app,support_credentials=True,resources={r"/": {"origins": "http://0.0.0.0/"}})

class RPS_Logs(db.Model):
    __tablename__ = 'RPS_Logs'
    __table_args__ = {'quote': False}
    id = db.Column(db.Integer, primary_key = True)
    N = db.Column(db.Integer, nullable = False, quote = False, name = 'N')
    repel = db.Column(db.Double,nullable = False)
    attract = db.Column(db.Double,nullable = False)
    inter = db.Column(db.Double,nullable = False)
    winner = db.Column(db.Integer)
    time_to_win = db.Column(db.Double)
    def __repr__(self):
        return 'Test: '

@app.route('/', methods=['POST'])
@cross_origin(supports_credentials=True)
def insert_data():
    try:
        data = request.json
        print(data)
        new_record = RPS_Logs(
            N = data['N'],
            repel = data['repel'],
            attract = data['attract'],
            inter = data['inter'],
            winner = data['winner'],
            time_to_win = data['time_to_win']
        )
        db.session.add(new_record)
        db.session.commit()

        response = jsonify({'message': 'Data inserted successfully'})
        response.headers.add('Access-Control-Allow-Origin', 'http://0.0.0.0/')

        return jsonify({'message': 'Data inserted successfully'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route("/", methods = ['GET'])
def index():
    data = RPS_Logs.query.all()
    col_counts = RPS_Logs.query.count()
    print(col_counts)
    return render_template("game.html", data=data, col_nums = col_counts)


if __name__ == "__main__":
    app.run(host = "0.0.0.0",port = 80, debug = True)
