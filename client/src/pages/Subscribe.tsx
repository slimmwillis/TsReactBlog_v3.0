import axios from "axios";
import { useState } from "react";
import { Button, Col, Form, Row, Stack } from "react-bootstrap";
import { toast } from "react-hot-toast";

const Subscribe = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  const subscribeHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (email) {
        await axios.post('/subscriber', { email });
        toast.success('Subscribed successfully');
        setEmail("");
      } else {
        throw new Error("Email is required");
      }
    } catch (error) {
      toast.error((error as any).response?.data ?? "Email is required");
    }
  };

  const deleteSubscriber = async () => {
    if (!email) {
      toast.error("Please provide an email to delete.");
      return;
    }

    try {
      setLoading(true);
      await axios.post("/deleteSubscriber", { emailToDelete: email });
      toast.success("Subscriber deleted successfully");
      setEmail("");
    } catch (error) {
      toast.error("Error deleting subscriber");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={subscribeHandler} style={{
      overflowX: "hidden"

    }}>
      <Row
        style={{
          height: "80vh",
          justifyContent: "center",
          paddingTop: "3%",
          overflowX: "hidden"
        }}
      >
        <Col sm={6} xs={11}>
          <Stack gap={3}>
            <Form.Control
              value={email}
              type="email"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button variant="primary" type="submit">
              {loading ? "Loading..." : "Subscribe"}
            </Button>
            <Button
              variant="danger"
              onClick={deleteSubscriber}
              disabled={loading}
            >
              {loading ? "Deleting..." : "Delete Subscriber"}
            </Button>
          </Stack>
        </Col>
      </Row>
    </Form>
  );
};

export default Subscribe;