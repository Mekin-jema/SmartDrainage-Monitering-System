import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// interface FAQProps {
//   question: string;
//   answer: string;
//   value: string;
// }

const FAQList = [
  {
    question: "What is the Smart Sewage Monitoring System?",
    answer:
      "It is an IoT-based solution that monitors sewage manholes using sensors to detect overflow levels, toxic gas concentrations, and enables real-time alerts and analytics through a web dashboard.",
    value: "item-1",
  },
  {
    question: "Which sensors are used in this system?",
    answer:
      "The system primarily uses ultrasonic sensors for level detection and MQ-series gas sensors to detect hazardous gases like methane or hydrogen sulfide in manholes.",
    value: "item-2",
  },
  {
    question: "How does the system notify workers about issues?",
    answer:
      "When overflow or dangerous gas levels are detected, the system sends alerts to assigned sewage workers based on their proximity, using the shortest path routing logic.",
    value: "item-3",
  },
  {
    question: "Can citizens report issues manually?",
    answer:
      "Yes. Each manhole has a QR code that redirects to a feedback form where users can report issues, which are then reviewed and prioritized in the dashboard.",
    value: "item-4",
  },
  {
    question: "Is machine learning used in this project?",
    answer:
      "Yes. The system uses machine learning models to predict overflow risks and detect spam or irrelevant feedback submitted by users.",
    value: "item-5",
  },
];


export const FAQSection = () => {
  return (
    <section id="faq" className="container md:w-[700px] py-24 sm:py-32 md:max-w-full mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-lg text-primary text-center mb-2 tracking-wider">
          FAQS
        </h2>

        <h2 className="text-3xl md:text-4xl text-center font-bold">
          Common Questions
        </h2>
      </div>

      <Accordion type="single" collapsible className="AccordionRoot">
        {FAQList.map(({ question, answer, value }) => (
          <AccordionItem key={value} value={value}>
            <AccordionTrigger className="text-left text-lg ">
              {question}
            </AccordionTrigger>

            <AccordionContent>{answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
};
