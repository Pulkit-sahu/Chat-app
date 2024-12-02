import os
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, decode_token, jwt_required, create_access_token, create_refresh_token, get_jwt_identity, verify_jwt_in_request
from flask_socketio import SocketIO, emit, join_room
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
from datetime import timedelta
from flask_cors import CORS

app = Flask(__name__)

# Configure CORS
CORS(app, supports_credentials=True)
# Initialize SocketIO with CORS allowed origins
socketio = SocketIO(app, cors_allowed_origins="*")

# Load app configuration (replace with your own config)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')

# app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///again.db'  # Example database URI
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'supersecretkey'  # Change to your secret key

# Initialize extensions
db = SQLAlchemy(app)
JWTManager(app)

# Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    role = db.Column(db.String(20), nullable=False)  # 'admin' or 'user'

class Chat(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    sender_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    receiver_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    content = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    read_status = db.Column(db.Boolean, default=False)  # New field for read status

# Routes for Auth (register, login)
@app.route('/auth/register', methods=['POST'])
def register():
    data = request.json
    new_user = User(
        name=data['name'],
        email=data['email'],
        password=generate_password_hash(data['password']),
        role=data['role']
    )
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'msg': 'Registration successful'}), 201

from flask import jsonify, request
from flask_jwt_extended import create_access_token, create_refresh_token
import json
from datetime import timedelta

from flask import jsonify, request
from flask_jwt_extended import create_access_token, create_refresh_token
import json

@app.route('/auth/login', methods=['POST']) 
def login():
    data = request.json
    user = User.query.filter_by(email=data['email'], role=data['role']).first()

    if user and check_password_hash(user.password, data['password']):
        # Serialize the identity as a JSON string
        identity = json.dumps({'id': str(user.id), 'role': user.role})
        access_token = create_access_token(identity=identity, expires_delta=timedelta(days=1))
        refresh_token = create_refresh_token(identity=identity)
        return jsonify(access_token=access_token, refresh_token=refresh_token, name=user.name), 200

    return jsonify({'msg': 'Invalid credentials'}), 401



# Routes for Chat (users, messages, send)
@app.route('/chat/admins', methods=['GET'])
def get_admins():
    try:
        admins = User.query.filter_by(role='admin').all()
        admins_data = [{"id": admin.id, "name": admin.name,"role":admin.role,} for admin in admins]
        return jsonify(admins_data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

from flask import jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
import json

from flask import jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
import json

@app.route('/chat/info', methods=['GET'])
@jwt_required()
def get_profile():
    try:
        # Retrieve and deserialize the token identity
        current_user = json.loads(get_jwt_identity())
        
        # Debugging: Log the identity payload
        print(f"Decoded token identity: {current_user}")

        # Ensure `id` exists in the payload
        if not current_user or 'id' not in current_user:
            return jsonify({"error": "Invalid token"}), 401

        # Fetch user from database using the ID
        user = User.query.get(current_user['id'])
        user_data = {"id":int(user.id),"name":user.name,"email":user.email,"role":user.role}
        return jsonify(user_data),200
        print(f"Fetched User: {user}")
        
        if not user:
            return jsonify({"error": "User not found"}), 404
        
        # Prepare response
        
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500



@app.route('/chat/users', methods=['GET'])
def get_users():
    try:
        users = User.query.filter_by(role='user').all()
        user_list = [{"id": user.id, "name": user.name,"role":user.role} for user in users]
        return jsonify(user_list), 200
    except Exception as e:
        return jsonify({"error": f"An error occurred while fetching users: {e}"}), 500

@app.route('/chat/messages/<int:receiver_id>', methods=['GET'])
@jwt_required()
def get_messages(receiver_id):
    current_user = json.loads(get_jwt_identity())
    current_user_id = int(current_user['id'])
    
    try:
        messages = Chat.query.filter(
            ((Chat.sender_id == current_user_id) & (Chat.receiver_id == receiver_id)) |
            ((Chat.sender_id == receiver_id) & (Chat.receiver_id == current_user_id))
        ).order_by(Chat.timestamp).all()
        
        messages_list = [
            {
                "id": msg.id,
                "sender_id": msg.sender_id,
                "receiver_id": msg.receiver_id,
                "content": msg.content,
                "timestamp": msg.timestamp,
                "read_status": msg.read_status
            }
            for msg in messages
        ]
        return jsonify(messages_list), 200
    except Exception as e:
        return jsonify({"error": f"An error occurred while fetching messages: {e}"}), 500

@app.route('/chat/loaded', methods=['GET'])
@jwt_required()
def get_messages_loaded():
    current_user = json.loads(get_jwt_identity())
    current_user_id = int(current_user['id'])
    try:
        messages = Chat.query.filter(
            ((Chat.sender_id == current_user_id) ) | ((Chat.receiver_id == current_user_id))
        ).order_by(Chat.timestamp).all()
        
        messages_list = [
            {
                "id": msg.id,
                "sender_id": msg.sender_id,
                "receiver_id": msg.receiver_id,
                "content": msg.content,
                "timestamp": msg.timestamp,
                "read_status": msg.read_status
            }
            for msg in messages
        ]
        return jsonify(messages_list), 200
    except Exception as e:
        return jsonify({"error": f"An error occurred while fetching messages: {e}"}), 500
        
@socketio.on('smessage')
@jwt_required()
def handle_send_message(data):
    try:
        
        user_identity = json.loads(get_jwt_identity())
        
        receiver_id = data['receiver_id']
        
        content = data['content']
        
        new_message = Chat(
            sender_id=int(user_identity['id']),
            receiver_id=receiver_id,
            content=content,
            timestamp=datetime.utcnow()
        )
        
        db.session.add(new_message)
        db.session.commit()
        
        # Emit message to the specific room
        message_data = {
            'sender_id': int(user_identity['id']),
            'receiver_id': receiver_id,
            'content': content,
            'timestamp': str(new_message.timestamp),
            'read_status': new_message.read_status
        }
        socketio.emit('receive_message', message_data)
        emit('message_sent', {'msg': 'Message sent successfully'}, room=request.sid)
    except Exception as e:
        db.session.rollback()
        emit('error', {'error': f"An error occurred: {str(e)}"})

# WebSocket event for marking messages as read
@socketio.on('mark_message_read')
@jwt_required()
def handle_mark_message_read(data):
    try:
        
        user_identity = json.loads(get_jwt_identity())
        
        sender_id = int(data['sender_id'])
        receiver_id = int(user_identity['id'])
        print(data)

        # Update the read status in the database
        Chat.query.filter_by(sender_id=sender_id, receiver_id=receiver_id, read_status=False).update({'read_status': True})
        db.session.commit()

        # Notify the sender about the read status update
        socketio.emit('read_status_update', {'sender_id': sender_id, 'receiver_id': receiver_id})
    except Exception as e:
        print(f"Error marking messages as read: {str(e)}")

# WebSocket connection and disconnection event handling
@socketio.on('connect')
@jwt_required()
def handle_connect(auth=None):
    
    user_identity = json.loads(get_jwt_identity())
    user_id = int(user_identity['id'])
    print(user_id)  
    message_data = {
            'User_id': int(user_identity['id']),
            'Connection' : True,
            } 
    print(message_data)
    if user_id:
        join_room(f"user_{user_id}")
        print(f"User {user_id} joined room user_{user_id}")
        socketio.emit('connection', message_data)
    

@socketio.on('disconnect')
def handle_disconnect():
    print("A client disconnected.")

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    socketio.run(app,allow_unsafe_werkzeug=True, host='0.0.0.0', port=5000, debug=True)


