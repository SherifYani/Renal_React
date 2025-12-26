function Notfound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        {/* Animated number */}
        <div className="relative mb-8">
          <div className="text-[180px] md:text-[240px] font-bold text-gray-200 dark:text-gray-800 leading-none tracking-tighter">
            404
          </div>

          {/* Decorative element */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="relative">
              <div className="text-6xl md:text-8xl font-bold text-blue-600 dark:text-blue-400 animate-pulse">
                404
              </div>

              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-blue-500 rounded-full opacity-70 animate-bounce"></div>
              <div
                className="absolute -bottom-4 -left-4 w-6 h-6 bg-purple-500 rounded-full opacity-70 animate-bounce"
                style={{ animationDelay: "0.2s" }}></div>
              <div
                className="absolute -top-6 -left-6 w-4 h-4 bg-pink-500 rounded-full opacity-70 animate-bounce"
                style={{ animationDelay: "0.4s" }}></div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">
            Page Not Found
          </h1>

          <p className="text-gray-600 dark:text-gray-300 text-lg mb-8 max-w-md mx-auto">
            The page you're looking for seems to have wandered off. Let's
            get you back on track.
          </p>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/"
              className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
              </svg>
              Go Home
            </a>

            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center justify-center px-8 py-4 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-white font-semibold rounded-2xl border border-gray-300 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-200">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              Go Back
            </button>
          </div>
        </div>

        {/* Decorative background elements */}
        <div className="fixed top-1/4 left-1/4 w-72 h-72 bg-blue-300 dark:bg-blue-900 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-20 animate-pulse"></div>
        <div
          className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-purple-300 dark:bg-purple-900 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-20 animate-pulse"
          style={{ animationDelay: "2s" }}></div>
      </div>
    </div>
  );
}

export default Notfound;
