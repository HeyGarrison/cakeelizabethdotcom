import React from "react";

import { XyzTransition } from "@animxyz/react";
import { Icon } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { GetStaticProps } from "next";
import Link from "next/link";
import {
  FaEnvelope,
  FaPhoneAlt,
  FaFileAlt,
  FaPaperPlane,
  FaUserTag,
} from "react-icons/fa";
import { MdChatBubble } from "react-icons/md";
import { formatPhoneNumber } from "react-phone-number-input";

import apiClient from "../clients/apiClient";
import CtaButton from "../components/CtaButton";
import InfoBox from "../components/InfoBox";
import Input from "../components/Input";
import { ContactForm } from "../models/ContactForm";
import appClasses from "../styles/pages/app.module.sass";
import classes from "../styles/pages/contact.module.sass";
import contactFormValidator from "../validation/contactFormValidator";

import { allPageContents } from ".contentlayer/data";
import type { PageContent } from ".contentlayer/types";

const Page = ({ content }: { content: PageContent }) => {
  const [submitting, setSubmitting] = React.useState(false);
  const [latestSubmissionResult, setLatestSubmissionResult] = React.useState<
    "success" | "error" | null
  >(null);

  return (
    <div className={appClasses.pageContainer}>
      <div className={appClasses.contentContainer}>
        <div className={classes.pageSplit}>
          <div>
            <XyzTransition xyz="small-25% fade stagger">
              {latestSubmissionResult !== "success" && (
                <div>
                  <Formik
                    initialValues={{
                      name: "",
                      email: "",
                      phoneNumber: "",
                      subject: "",
                      message: "",
                    }}
                    validationSchema={contactFormValidator.schema}
                    validateOnMount
                    onSubmit={async ({ phoneNumber, ...form }: ContactForm) => {
                      setLatestSubmissionResult(null);
                      setSubmitting(true);
                      const success = await apiClient.submitContactForm({
                        ...form,
                        phoneNumber: formatPhoneNumber(phoneNumber),
                      });
                      setLatestSubmissionResult(success ? "success" : "error");
                      setSubmitting(false);
                    }}
                  >
                    <Form className={classes.form}>
                      <Input
                        name="name"
                        left={<Icon color="gray.300" as={FaUserTag} />}
                        label={content.data.form.name}
                        required
                      />
                      <Input
                        name="email"
                        left={<Icon color="gray.300" as={FaEnvelope} />}
                        label={content.data.form.email}
                        required
                      />
                      <Input
                        name="phoneNumber"
                        left={<Icon color="gray.300" as={FaPhoneAlt} />}
                        label={content.data.form.phoneNumber}
                        phoneNumber
                        type="tel"
                      />
                      <Input
                        name="subject"
                        left={<Icon color="gray.300" as={MdChatBubble} />}
                        label={content.data.form.subject}
                      />
                      <Input
                        name="message"
                        left={<Icon color="gray.300" as={FaFileAlt} />}
                        label={content.data.form.message}
                        required
                        textarea
                      />
                      <div className={classes.submit}>
                        <CtaButton
                          loading={submitting}
                          leftIcon={<Icon as={FaPaperPlane} />}
                          type="submit"
                        >
                          {content.data.form.send}
                        </CtaButton>
                      </div>
                    </Form>
                  </Formik>
                  <XyzTransition xyz="small-25% fade stagger">
                    {latestSubmissionResult === "error" && (
                      <div>
                        <SubmissionStatusBox
                          content={content}
                          submissionResult={latestSubmissionResult}
                        />
                      </div>
                    )}
                  </XyzTransition>
                </div>
              )}
              {latestSubmissionResult === "success" && (
                <div>
                  <SubmissionStatusBox
                    content={content}
                    submissionResult={latestSubmissionResult}
                  />
                </div>
              )}
            </XyzTransition>
          </div>
          <div className={classes.contactBlock}>
            <h2>{content.data.contact.name}</h2>
            <div>
              <p>{content.data.contact.address.street}</p>
              <p>{content.data.contact.address.cityState}</p>
              <p>{content.data.contact.address.zip}</p>
            </div>
            <div>
              <a href={`tel:${content.data.contact.phone.literal}`}>
                {content.data.contact.phone.display}
              </a>
            </div>
            <div>
              <Link href={content.data.contact.web.literal}>
                {content.data.contact.web.display}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SubmissionStatusBox = ({
  content,
  submissionResult,
}: {
  content: PageContent;
  submissionResult: "success" | "error";
}) => (
  <InfoBox state={submissionResult}>
    <span
      className={appClasses.htmlRoot}
      dangerouslySetInnerHTML={{
        __html: content.data.formResult[submissionResult],
      }}
    />
  </InfoBox>
);

export const getStaticProps: GetStaticProps = async () => {
  const content = allPageContents.find(({ page }) => page === "contact");
  return { props: { content } };
};

export default Page;
