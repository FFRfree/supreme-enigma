export default function Layout({ children }: { children: any }) {
  return (
    <>
      <div>nav</div>
      <main>{children}</main>
      <div>footer</div>
    </>
  )
}
