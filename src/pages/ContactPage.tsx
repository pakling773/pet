import NewsLetter from "../components/NewsLetter";
import ContactBreadCumb from "../components/contacts/ContactBreadCumb";
import ContactForm from "../components/contacts/ContactForm";

function ContactPage() {
  return (
    <main>
      <ContactBreadCumb />
      <ContactForm />
      <NewsLetter />
    </main>
  );
}

export default ContactPage;
