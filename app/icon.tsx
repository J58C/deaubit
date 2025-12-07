//app/icon.tsx

import { ImageResponse } from 'next/og';

export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #4f46e5 0%, #0ea5e9 100%)',
          border: '3px solid #000000',
          borderRadius: '0px',
          color: 'white',
          fontSize: 20,
          fontWeight: 900,
          fontFamily: 'sans-serif',
          textShadow: '1px 1px 0px rgba(0,0,0,0.3)',
        }}
      >
        D
      </div>
    ),
    {
      ...size,
    }
  );
}
