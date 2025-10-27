import Link from "next/link"
import { FaGithub, FaLinkedin } from "react-icons/fa"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-6">
      <div className="container mx-auto px-8 flex flex-row items-center justify-between">
        <p className="text-sm">
          © <span className="text-white font-semibold hover:text-blue-400 transition cursor-pointer">
            MiguelStore
          </span>{" "}
          - Todos los derechos reservados.
        </p>

        <div className="flex gap-6 text-xl">
          <Link
            href="https://www.linkedin.com/in/miguelrojasoficial/"
            target="_blank"
            className="hover:text-blue-400 hover:scale-110 transition transform"
          >
            <FaLinkedin size={22} />
          </Link>
          <Link
            href="https://github.com/MiguelRojasOfficial"
            target="_blank"
            className="hover:text-white hover:scale-110 transition transform"
          >
            <FaGithub size={22} />
          </Link>
          <Link
            href="https://miguelrojasoficial.onrender.com"
            target="_blank"
            className="hover:text-gray-200 hover:scale-110 transition transform"
          >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 36 36"
                fill="currentColor"
                className="w-6 h-6"
                aria-hidden="true"
              >
                <path d="M26.827.01c-4.596-.216-8.461 3.107-9.12 7.487-.027.203-.066.4-.099.596-1.025 5.454-5.797 9.584-11.53 9.584a11.67 11.67 0 0 1-5.634-1.442.298.298 0 0 0-.444.262v18.854h17.602V22.097c0-2.439 1.971-4.419 4.4-4.419h4.4c4.982 0 8.99-4.15 8.795-9.197C35.02 3.937 31.35.226 26.827.01Z"/>
              </svg>
          </Link>
        </div>
      </div>
    </footer>
  )
}
