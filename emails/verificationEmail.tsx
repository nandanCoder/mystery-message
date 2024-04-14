import {
  Button,
  Font,
  Html,
  Head,
  Row,
  Text,
  Section,
  Preview,
  Heading,
} from "@react-email/components";

interface VerificationEmailProps {
  username: string;
  otp: string;
}
export default function VerificationEmail({
  username,
  otp,
}: VerificationEmailProps) {
  return (
    <Html lang="en" dir="ltr">
      <Head>
        <title>Verification Code</title>
        <Font
          fontFamily="Roboto"
          fallbackFontFamily="Verdana"
          webFont={{
            url: "https://fonts.googleapis.com/css2?family=Roboto&display=swap",
            format: "woff2",
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Preview>Here&apos;s your verification code: {otp} </Preview>
      <Section>
        <Row>
          <Heading as="h2">Hellow {username}</Heading>
        </Row>
        <Row>
          <Text>
            Thank you for registering with us. Please use this code to verify
            your email.
            <br />
            This code will expire in 10 minutes.
          </Text>
        </Row>
        <Row>
          <Text>
            Your verification code is <strong>{otp}</strong>
          </Text>
        </Row>
        <Row>
          <Text>
            If you did not register with us, please ignore this email.
          </Text>
        </Row>
      </Section>
      {/* <Button
        href="https://example.com"
        style={{ background: "#000", color: "#fff", padding: "12px 20px" }}>
        Click me
      </Button> */}
    </Html>
  );
}
