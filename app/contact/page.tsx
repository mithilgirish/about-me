export default function Contact() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4 text-amber-900">Get in Touch</h1>
      <form className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-amber-900">Name</label>
          <input type="text" id="name" name="name" className="w-full p-2 border border-amber-300 rounded" />
        </div>
        <div>
          <label htmlFor="email" className="block text-amber-900">Email</label>
          <input type="email" id="email" name="email" className="w-full p-2 border border-amber-300 rounded" />
        </div>
        <div>
          <label htmlFor="message" className="block text-amber-900">Message</label>
          <textarea id="message" name="message" rows={4} className="w-full p-2 border border-amber-300 rounded"></textarea>
        </div>
        <button type="submit" className="bg-amber-700 text-white px-4 py-2 rounded hover:bg-amber-800">Send Message</button>
      </form>
    </div>
  )
}
