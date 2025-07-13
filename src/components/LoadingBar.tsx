import LoadingIcon from "../asset/loadingIcon"

export default function LoadingBar() {
  return (
    <div className="container fixed top-0 left-0 w-full h-full backdrop-blur-xs flex items-center justify-center bg-white/80">
      <LoadingIcon />
    </div>
  )
}
