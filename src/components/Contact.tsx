export default function Contact() {
  return (
    <section id="contact" className="py-24 px-6">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4">Let&apos;s Connect</h2>
        <p className="text-gray-400 mb-8">Open to opportunities, feel free to reach out.</p>
        <a href="mailto:thesaadster.dev@gmail.com"
          className="bg-white text-black px-8 py-3 rounded-lg font-medium hover:bg-gray-200 transition inline-block">
          Get In Touch
        </a>
        <div className="flex gap-6 justify-center mt-8 text-gray-400">
          <a href="https://github.com/TheSaadster" target="_blank" className="hover:text-white transition">GitHub</a>
          <a href="https://www.youtube.com/@the_saadster" target="_blank" className="hover:text-white transition">YouTube</a>
          <a href="https://x.com/thesaadster_dev" target="_blank" className="hover:text-white transition">X (or Twitter)</a>

        </div>
      </div>
    </section>
  );
}