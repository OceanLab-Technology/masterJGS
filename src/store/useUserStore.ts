import { create } from "zustand";
import axios from "axios";

export interface User {
  id: string;
  nickname: string;
  type: "Client";
  enabled: boolean;
  locked: boolean;
}

export interface CreateUserData {
  nickname: string;
  password: string;
}

export interface UpdateUserData {
  nickname: string;
  enabled: boolean;
  locked: boolean;
}

export interface ChangePasswordData {
  newPassword: string;
  confirmPassword: string;
}

interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
  fetchUsers: () => Promise<void>;
  createUser: (userData: CreateUserData) => Promise<void>;
  updateUser: (id: string, userData: UpdateUserData) => Promise<void>;
  changePassword: (id: string, passwordData: ChangePasswordData) => Promise<void>;
  updateUserLocally: (id: string, partial: Partial<User>) => void;
}

const mockUsers: User[] = [
  {
    "id": "U001",
    "nickname": "john_doe",
    "type": "Client",
    "enabled": true,
    "locked": false
  },
  {
    "id": "U002",
    "nickname": "jane_smith",
    "type": "Client",
    "enabled": false,
    "locked": true
  },
  {
    "id": "U003",
    "nickname": "mike_wilson",
    "type": "Client", 
    "enabled": true,
    "locked": false
  },
  {
    "id": "U004",
    "nickname": "sarah_connor",
    "type": "Client",
    "enabled": false,
    "locked": false
  },
  {
    "id": "U005",
    "nickname": "alex_morgan",
    "type": "Client",
    "enabled": true,
    "locked": true
  }
];

export const useUserStore = create<UserState>((set, get) => ({
  users: [],
  loading: false,
  error: null,

  fetchUsers: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get<User[]>("/api/users");
      console.log("Fetched users:", res.data);
      set({ users: res.data, loading: false });
    } catch (err) {
      console.error("API failed, using mock data:", err);
      set({ users: mockUsers, loading: false });
    }
  },

  createUser: async (userData: CreateUserData) => {
    try {
      const res = await axios.post<User>("/api/users", userData);
      set((state) => ({
        users: [...state.users, res.data],
      }));
    } catch (err) {
      console.error("Create user API failed, using mock:", err);
      // Generate new ID
      const existingIds = get().users.map(u => parseInt(u.id.replace('U', '')));
      const newIdNumber = Math.max(...existingIds, 0) + 1;
      const newId = `U${newIdNumber.toString().padStart(3, '0')}`;
      
      const newUser: User = {
        id: newId,
        nickname: userData.nickname,
        type: "Client",
        enabled: true,
        locked: false,
      };
      
      set((state) => ({
        users: [...state.users, newUser],
      }));
    }
  },

  updateUser: async (id: string, userData: UpdateUserData) => {
    try {
      const res = await axios.put<User>(`/api/users/${id}`, userData);
      set((state) => ({
        users: state.users.map((user) =>
          user.id === id ? res.data : user
        ),
      }));
    } catch (err) {
      console.error("Update user API failed, using mock:", err);
      set((state) => ({
        users: state.users.map((user) =>
          user.id === id ? { ...user, ...userData } : user
        ),
      }));
    }
  },

  changePassword: async (id: string, passwordData: ChangePasswordData) => {
    try {
      await axios.post(`/api/users/${id}/change-password`, passwordData);
    } catch (err) {
      console.error("Change password API failed, simulating success:", err);
    }
  },

  updateUserLocally: (id, partial) => {
    set((state) => ({
      users: state.users.map((user) =>
        user.id === id ? { ...user, ...partial } : user
      ),
    }));
  },
})); 