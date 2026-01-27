import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Ticket, TimelineEntry, TicketStatus } from "@/lib/types";
import { dummyTickets } from "@/lib/dummy-data";

interface TicketState {
  tickets: Ticket[];
  createTicket: (ticket: Omit<Ticket, "id" | "createdAt" | "updatedAt" | "timeline">) => Ticket;
  updateTicketStatus: (id: string, status: TicketStatus, note: string, by: string) => void;
  addComment: (ticketId: string, comment: TimelineEntry) => void;
  assignTicket: (ticketId: string, assignedTo: string, by: string) => void;
  getTicketsByCustomer: (customerId: string) => Ticket[];
  getTicketById: (id: string) => Ticket | undefined;
}

export const useTicketStore = create<TicketState>()(
  persist(
    (set, get) => ({
      tickets: dummyTickets || [],
      
      createTicket: (ticket) => {
        const newTicket: Ticket = {
          ...ticket,
          id: `TKT${String((get().tickets || []).length + 1).padStart(3, "0")}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          timeline: [
            {
              action: "Ticket Created",
              by: ticket.customerId,
              at: new Date().toISOString(),
              note: "Initial ticket submission"
            }
          ]
        };
        
        set((state) => ({
          tickets: [...state.tickets, newTicket]
        }));
        
        return newTicket;
      },
      
      updateTicketStatus: (id, status, note, by) => {
        set((state) => ({
          tickets: state.tickets.map((ticket) => {
            if (ticket.id === id) {
              return {
                ...ticket,
                status,
                updatedAt: new Date().toISOString(),
                timeline: [
                  ...ticket.timeline,
                  {
                    action: `Status Updated to ${status.replace("_", " ")}`,
                    by,
                    at: new Date().toISOString(),
                    note
                  }
                ]
              };
            }
            return ticket;
          })
        }));
      },
      
      addComment: (ticketId, comment) => {
        set((state) => ({
          tickets: state.tickets.map((ticket) => {
            if (ticket.id === ticketId) {
              return {
                ...ticket,
                updatedAt: new Date().toISOString(),
                timeline: [...ticket.timeline, comment]
              };
            }
            return ticket;
          })
        }));
      },
      
      assignTicket: (ticketId, assignedTo, by) => {
        set((state) => ({
          tickets: state.tickets.map((ticket) => {
            if (ticket.id === ticketId) {
              return {
                ...ticket,
                assignedTo,
                updatedAt: new Date().toISOString(),
                timeline: [
                  ...ticket.timeline,
                  {
                    action: "Ticket Assigned",
                    by,
                    at: new Date().toISOString(),
                    note: `Assigned to ${assignedTo}`
                  }
                ]
              };
            }
            return ticket;
          })
        }));
      },
      
      getTicketsByCustomer: (customerId) => {
        return (get().tickets || []).filter((ticket) => ticket.customerId === customerId);
      },
      
      getTicketById: (id) => {
        return (get().tickets || []).find((ticket) => ticket.id === id);
      }
    }),
    {
      name: "ticket-storage"
    }
  )
);
