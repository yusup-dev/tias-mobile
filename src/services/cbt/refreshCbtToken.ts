import axiosTias from '../../config/axios-tias';
import { useTokenStore } from '../../store/auth';

// Promise yang sedang berjalan, dipakai untuk dedupe (anti-balapan):
// kalau banyak request CBT gagal bersamaan, SSO hanya jalan SEKALI.
let refreshPromise: Promise<string | null> | null = null;

/**
 * SSO ulang ke TIAS Backend untuk menukar JWT TIAS menjadi token CBT baru.
 * Mengikuti pola useCbtLogin: POST cbt/auth dengan header `token` (BUKAN Authorization),
 * respons berbentuk { success, data: { cbt_token, cbt_user_id, expires_at? } }.
 * Mengembalikan cbt_token baru, atau null bila gagal (token sudah dibersihkan).
 */
export async function refreshCbtToken(): Promise<string | null> {
  if (refreshPromise) return refreshPromise; // dedupe

  refreshPromise = (async () => {
    const jwtTias = useTokenStore.getState().token;
    if (!jwtTias) return null; // belum login → tidak bisa SSO

    try {
      const { data } = await axiosTias.post(
        'cbt/auth',
        {},
        { headers: { token: jwtTias } }, // header 'token', BUKAN Authorization
      );

      const cbtToken = data?.data?.cbt_token;
      if (!data?.success || !cbtToken) return null;

      const expiresAt = data?.data?.expires_at
        ? new Date(data.data.expires_at).getTime()
        : Date.now() + 8 * 60 * 60 * 1000;

      useTokenStore
        .getState()
        .setCbtToken(cbtToken, data.data.cbt_user_id, expiresAt);
      return cbtToken;
    } catch (e) {
      // SSO gagal (mis. JWT TIAS ikut mati) → bersihkan agar UI dapat jalur bersih
      useTokenStore.getState().clearCbtToken();
      return null;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}
