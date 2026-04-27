package notifications

import (
	"sync"
)

type Client chan string

type NotificationHub struct {
	clients map[Client]bool
	mu      sync.Mutex
}

func NewHub() *NotificationHub {
	return &NotificationHub{
		clients: make(map[Client]bool),
	}
}

func (h *NotificationHub) AddClient(c Client) {
	h.mu.Lock()
	defer h.mu.Unlock()
	h.clients[c] = true
}

func (h *NotificationHub) RemoveClient(c Client) {
	h.mu.Lock()
	defer h.mu.Unlock()
	delete(h.clients, c)
	close(c)
}

func (h *NotificationHub) Broadcast(message string) {
	h.mu.Lock()
	defer h.mu.Unlock()

	for client := range h.clients {
		select {
		case client <- message:
		default:
			// drop slow client
			delete(h.clients, client)
			close(client)
		}
	}
}
