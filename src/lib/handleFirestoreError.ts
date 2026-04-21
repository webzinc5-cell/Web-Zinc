import { auth } from "./firebase";

export interface FirestoreErrorInfo {
  error: string;
  operationType: 'create' | 'update' | 'delete' | 'list' | 'get' | 'write';
  path: string | null;
  authInfo: {
    userId: string;
    email: string;
    emailVerified: boolean;
    isAnonymous: boolean;
    providerInfo: { providerId: string; displayName: string; email: string; }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: FirestoreErrorInfo['operationType'], path: string | null) {
  if (error && typeof error === 'object' && 'message' in error) {
    const errorMsg = (error as Error).message;
    if (errorMsg.includes('Missing or insufficient permissions') || errorMsg.includes('permission_denied')) {
      const user = auth.currentUser;
      const errorInfo: FirestoreErrorInfo = {
        error: errorMsg,
        operationType,
        path,
        authInfo: {
          userId: user?.uid || '',
          email: user?.email || '',
          emailVerified: user?.emailVerified || false,
          isAnonymous: user?.isAnonymous || false,
          providerInfo: user?.providerData.map(p => ({
            providerId: p.providerId,
            displayName: p.displayName || '',
            email: p.email || ''
          })) || []
        }
      };
      // Important: You MUST throw a JSON string as per system instructions
      throw JSON.stringify(errorInfo);
    }
  }
  throw error;
}
