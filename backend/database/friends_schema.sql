-- ========================================
-- SISTEMA DE AMIGOS
-- ========================================

-- Tabla de amistades
CREATE TABLE IF NOT EXISTS friendships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  friend_id UUID NOT NULL,
  status VARCHAR(20) DEFAULT 'pending', -- pending, accepted, rejected, blocked
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_friend FOREIGN KEY (friend_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT unique_friendship UNIQUE (user_id, friend_id),
  CONSTRAINT check_not_self CHECK (user_id != friend_id)
);

-- Índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_friendships_user ON friendships(user_id, status);
CREATE INDEX IF NOT EXISTS idx_friendships_friend ON friendships(friend_id, status);
CREATE INDEX IF NOT EXISTS idx_friendships_created ON friendships(created_at DESC);

-- Tabla de mensajes entre amigos
CREATE TABLE IF NOT EXISTS friend_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL,
  receiver_id UUID NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT fk_sender FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_receiver FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Índices para mensajes
CREATE INDEX IF NOT EXISTS idx_messages_sender ON friend_messages(sender_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_receiver ON friend_messages(receiver_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON friend_messages(sender_id, receiver_id, created_at);
CREATE INDEX IF NOT EXISTS idx_messages_unread ON friend_messages(receiver_id, is_read);

-- Tabla de metas compartidas
CREATE TABLE IF NOT EXISTS shared_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  goal_id UUID NOT NULL,
  owner_id UUID NOT NULL,
  shared_with_id UUID NOT NULL,
  can_edit BOOLEAN DEFAULT FALSE,
  can_view_progress BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT fk_goal FOREIGN KEY (goal_id) REFERENCES goals(id) ON DELETE CASCADE,
  CONSTRAINT fk_owner FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_shared_with FOREIGN KEY (shared_with_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT unique_share UNIQUE (goal_id, shared_with_id)
);

-- Índices para metas compartidas
CREATE INDEX IF NOT EXISTS idx_shared_goals_owner ON shared_goals(owner_id);
CREATE INDEX IF NOT EXISTS idx_shared_goals_shared ON shared_goals(shared_with_id);
CREATE INDEX IF NOT EXISTS idx_shared_goals_goal ON shared_goals(goal_id);
