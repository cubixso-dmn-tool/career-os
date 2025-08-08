-- Expert Connections Table
CREATE TABLE expert_connections (
    id SERIAL PRIMARY KEY,
    expert_id INTEGER NOT NULL REFERENCES industry_experts(id),
    user_id INTEGER NOT NULL REFERENCES users(id),
    connection_type TEXT NOT NULL, -- 'chat', 'mentorship', 'consultation'
    status TEXT DEFAULT 'active' NOT NULL, -- 'active', 'closed', 'blocked'  
    purpose TEXT NOT NULL, -- User's reason for connecting
    message TEXT, -- Initial connection message
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    last_activity_at TIMESTAMP DEFAULT NOW()
);

-- Expert Messages Table 
CREATE TABLE expert_messages (
    id SERIAL PRIMARY KEY,
    connection_id INTEGER NOT NULL REFERENCES expert_connections(id),
    sender_id INTEGER NOT NULL REFERENCES users(id),
    receiver_id INTEGER NOT NULL REFERENCES users(id),
    message TEXT NOT NULL,
    message_type TEXT DEFAULT 'text' NOT NULL, -- 'text', 'image', 'file', 'voice'
    attachment_url TEXT,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    edited_at TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_expert_connections_expert_id ON expert_connections(expert_id);
CREATE INDEX idx_expert_connections_user_id ON expert_connections(user_id);
CREATE INDEX idx_expert_connections_status ON expert_connections(status);
CREATE INDEX idx_expert_messages_connection_id ON expert_messages(connection_id);
CREATE INDEX idx_expert_messages_created_at ON expert_messages(created_at);