import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hi Spot Daily — 오늘의 미션 에이전트",
  description: "Gemini가 분석한 오늘 상태를 바탕으로 미션 3개와 주변 spot을 연결해드립니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
