
export type User = {
  id: number
  name: string;
  email: string;
  password: string;
};
export type UserAction =
  | { type: 'CREATE_USER'; payload: User }
  | { type: 'UPDATE_USER'; payload: Partial<User> }
  | { type: 'RESET_USER' }
  | { type: 'LOGOUT' }; // הוספתי את ה־action 'LOGOUT'

export const initialState: User = {
  id: 0,
  name: "",
  email: "",
  password: "",
};

export const userReducer = (state: User, action: UserAction): User => {
  switch (action.type) {
    case 'CREATE_USER':
      return { ...state, ...action.payload };
    case 'UPDATE_USER':
      return { ...state, ...action.payload };
    case 'RESET_USER':
      return initialState;
    case 'LOGOUT':  // הוספתי את טיפול ב־LOGOUT
      return initialState; // מחזיר את ה־state למצב התחלתי
    default:
      return state;
  }
};
