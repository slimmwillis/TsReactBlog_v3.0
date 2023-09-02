import React from "react";
import "../assets/style/Home.css";

const Home: React.FC = () => {
  return (
    <div className="container">
      <div className="title">Welcome to my blog </div>
      <div className="post-content">
        <p>
          I often find myself refraining from engaging in Facebook posts due to
          my reservations about the pursuit of validation through likes and
          comments. The constant management of such interactions can become
          overwhelming. However, my true joy lies in sharing my passions and
          interests, as well as embracing the enriching content shared by
          others.
        </p>
        <p>
          It's worth noting that those who visit my Facebook profile will
          notice my tendency to abstain from frequent likes and comments. This
          practice, which I have adopted, has led to a remarkable improvement
          in the tranquility of my daily life. The reduction in stressors has
          been significant. I have intentionally chosen to detach myself from
          the cycle of reactions and responses commonly found in online
          interactions. This conscious choice has allowed me to cultivate a
          greater sense of harmony.
        </p>
        <p>
          Within this virtual space, my intention is to share a diverse range
          of subjects that deeply intrigue me. If my offerings resonate with
          you, I extend a warm invitation to subscribe. Feel free to engage by
          clicking the distinctive crimson 'Subscribe' button. Additionally, I
          encourage you to explore my YouTube and Facebook pages and consider
          subscribing to those platforms as well. Should you ever wish to
          discontinue receiving updates, the process is straightforward: click
          the 'Subscribe' button, input your email address, and proceed to
          'delete.'
        </p>
        <p>
          Your presence on this journey of intellectual exchange and shared
          interests is greatly appreciated.
        </p>
      </div>
    </div>
  );
};

export default Home;
