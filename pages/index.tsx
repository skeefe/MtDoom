import Container from "../components/container";
import Layout from "../components/layout";
import { getAllProjects } from "../lib/api";
import Head from "next/head";
import Project from "../types/project";
import ProjectPreview from "../components/project-preview";
import Image from "next/image";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

import React, { useState } from "react";

import "react-tabs/style/react-tabs.css";

type Props = {
  allProjects: Project[];
};

const Index = ({ allProjects }: Props) => {
  //console.log("allProjects", allProjects);
  const projects = allProjects.sort((a, b) =>
    a.projectNumber < b.projectNumber
      ? 1
      : b.projectNumber < a.projectNumber
      ? -1
      : 0
  );
  //console.log("projects", projects);
  return (
    <>
      <Layout>
        <Head>
          <title>Simon Keefe - Digital Project Management</title>
        </Head>
        <Container>
          <div className="grid lg:grid-cols-2 gap-x-12">
            <div>
              <section id="home">
                <div className="content">
                  <div className="md:flex justify-between mb-5">
                    <div className="md:text-left overflow-auto">
                      <h1 className="text-2xl md:text-5xl font-bold md:pr-8 sm:float-left md:float-none leading-normal text-center sm:text-left">
                        Simon Keefe
                        <span className="block text-xl md:text-2xl font-bold md:pr-8">
                          Digital Product Management
                        </span>
                      </h1>
                      <a
                        href="https://www.credly.com/badges/4be73cc2-56f5-41ed-9f10-7c505c6149ee?source=linked_in_profile"
                        target="_blank"
                        className="float-right md:float-none no-underline"
                      >
                        <div className="flex items-center hidden sm:flex">
                          <Image
                            src="/assets/home/capm.png"
                            layout="intrinsic"
                            width="75"
                            height="75"
                            className="rounded-full"
                          />
                          <span className="px-5 hidden md:inline-block">
                            Certified Associate
                            <br />
                            in Project Management
                          </span>
                        </div>
                      </a>
                    </div>
                    <div className="text-center">
                      <Image
                        src="/assets/home/skeefe.jpg"
                        layout="intrinsic"
                        width="200"
                        height="200"
                        className="rounded-full"
                      />
                    </div>
                  </div>
                  <p>
                    My name is Simon Keefe and I am the Product Manager at{" "}
                    <a href="https://xplorer.rugby" target="_blank">
                      Rugby Xplorer
                    </a>, Rugby Australia. I lead a great team to create a wide range of digital
                    products used in all facets of Rugby - from local club rugby
                    to our national teams. It is awesome being able to use my
                    skillset in an industry I am passionate about.
                  </p>
                  <p>
                    My primary role is to work with key stakeholders and the Technology team to 
                    define and prioritise requirements, setting the direction for the Rugby Xplorer platform. I
                    am involved with projects from their conception to launch,
                    including ascertaining stakeholder goals, resource requirements, associated costs
                    and timelines.
                  </p>
                  <p>
                    Prior to my current role, I was the Digital Technology Manager
                    Developer at{" "}
                    <a href="https://australia.rugby" target="_blank">
                      Rugby Australia
                    </a>{" "}
                    and prior to this at{" "}
                    <a
                      href="https://cornerstone-digital.com.au/"
                      target="_blank"
                    >
                      Cornerstone Digital
                    </a>
                    .
                  </p>
                </div>
              </section>
              <section id="skillset">
                <div className="content">
                  <div>
                    <h2 className="text-lg md:text-xl font-bold md:pr-8">
                      Primary Skillset
                    </h2>
                    <Tabs>
                      <TabList>
                        <Tab>
                          <span>Product Management</span>
                        </Tab>
                        <Tab>
                          <span className="hidden sm:inline">
                            Web Development
                          </span>
                          <span className="sm:hidden">Dev</span>
                        </Tab>
                      </TabList>

                      <TabPanel>
                        <div className="p-4">
                          <ul className="list-disc sm:cols-2 lg:cols-1 xl:cols-2">
                            <li>Assessing Stakeholder Requirements</li>
                            <li>Project Scoping and Quoting</li>
                            <li>Information Architecture</li>
                            <li>UX Planning</li>
                            <li>Running Sprint Meetings - JIRA</li>
                            <li>
                              Internal and External Stakeholder Management and
                              Communication
                            </li>
                            <li>Documentation - Confluence</li>
                            <li>Quality Control</li>
                            <li>Stakeholder Training</li>
                            <li>Contractor Management</li>
                          </ul>
                        </div>
                      </TabPanel>
                      <TabPanel>
                        <div className="p-4">
                          <ul className="list-disc sm:cols-2 lg:cols-1 xl:cols-2">
                            <li>HTML5</li>
                            <li>CSS3 - SASS, Tailwind CSS, Emotion</li>
                            <li>Javascript - ReactJS, Next.js, Lodash, jQuery</li>
                            <li>Responsive Development</li>
                            <li>
                              CMS - Keystone JS, Sitecore, WordPress, Adobe
                              Business Catalyst
                            </li>
                            <li>Web Support and Training</li>
                            <li>Source Control - Bitbucket, Github</li>
                            <li>C# .NET Core - Updates and Maintenance</li>
                            <li>PHP</li>
                            <li>SQL</li>
                            <li>Zeplin/Adobe Photoshop</li>
                            <li>Visual Code/Visual Studio</li>
                            <li>Adobe PhotoShop, Illustrator</li>
                            <li>GitHub, BitBucket</li>
                          </ul>
                        </div>
                      </TabPanel>
                    </Tabs>
                  </div>
                </div>
              </section>
              <section id="experience">
                <div className="content">
                  <div>
                    <h2 className="text-lg md:text-xl font-bold md:pr-8">
                      Recent Experience
                    </h2>
                    <div className="sub-item">
                      <div className="sm:flex items-start">
                        <div className="w-20 flex-none float-right ml-2 sm:float-none sm:ml-0">
                          <Image
                            src="/assets/home/rugby-xplorer-2.png"
                            layout="intrinsic"
                            width="75"
                            height="75"
                            className="rounded-full"
                          />
                        </div>
                        <div className="pl-4">
                          <h3 className="mb-0">
                            <strong>Product Manager, Rugby Xplorer</strong> - Rugby
                            Australia
                          </h3>
                          <span className="text-sm italic mb-4 block">
                            February 2022 - Present
                          </span>
                          <p>
                            In 2022 I received the opportunity to make a change from Development to Product Management, 
                            leading the team on our flagship digital platform, Rugby Xplorer.
                            This has been a significant career change however I have the support of an experienced
                            team behind me and have found my experience working as a Developer has proven valuable.
                          </p>
                          <p>Rugby Xplorer(RX) is a Digital Platform that enables fans, players, coaches, officials and administrators to follow, participate and manage every facet of Rugby Union.
                            RX enables competition administrators to create and manage competitions, participants to register to clubs and a thousands of websites catering for community Rugby Clubs all the way up to National teams.
                          </p>
                          <p>At the start of 2022 we took on a significant challenge of bringing USA Rugby on to the platform. There were many unknowns going in to this project ranging from ensuring RX complies with USA legislation,
                            to rolling out significant changes to RX to enable it to handle USA Rugby's dynamic governance structure. That said I am really proud of what we accomplished, RX launched successfully in time for Club registrations!
                          </p>
                          <p>
                            In addition I have been managing the High Performance Analytics team which was a very new area for me. This has been really interesting working
                            closely with the coaches and support staff to provide dashboards and reports used in team selection, injury prevention and on game day! I am really enjoying this challenge.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="sub-item">
                      <div className="sm:flex items-start">
                        <div className="w-20 flex-none float-right ml-2 sm:float-none sm:ml-0">
                          <Image
                            src="/assets/home/rugby-au.png"
                            layout="intrinsic"
                            width="75"
                            height="75"
                            className="rounded-full"
                          />
                        </div>
                        <div className="pl-4">
                          <h3 className="mb-0">
                            <strong>Digital Technology Manager</strong> - Rugby
                            Australia
                          </h3>
                          <span className="text-sm italic mb-4 block">
                            April 2019 - February 2022
                          </span>
                          <p>
                            My primary role involved working closely with both
                            internal and external Business Owners and Developers
                            to continually enhance the 36 sites in the Rugby
                            Network. I have the chance to work with a great team
                            who are passionate for the game and the positive
                            impact Technology can have for both fans and
                            participants.
                          </p>
                          <p>
                            Shortly after starting this role, the decision was
                            made to move our sites from Sitecore to{" "}
                            <a href="https://keystonejs.com/">KeystoneJS</a>, a
                            headless CMS that runs on NextJS. I then lead a Dev team through this process, liasing
                            closely with{" "}
                            <a
                              href="https://www.thinkmill.com.au/"
                              target="_blank"
                            >
                              ThinkMill
                            </a>{" "}
                            (who created KeystoneJS) to ensure best practices
                            are followed - they taught us a lot!
                          </p>
                          <p>
                            Whilst this has been a lengthy process (especially
                            due to Covid19) we were able to launch all of the
                            club and state sites in the small window between the
                            end of the 2021 season and before Memberships
                            campaigns and Registrations kick off for 2022. This
                            was a massive team effort and something I am really
                            proud of!
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="sub-item">
                      <div className="sm:flex items-start">
                        <div className="w-20 flex-none float-right ml-2 sm:float-none sm:ml-0">
                          <Image
                            src="/assets/home/rugby-au.png"
                            layout="intrinsic"
                            width="75"
                            height="75"
                            className="rounded-full"
                          />
                        </div>
                        <div className="pl-4">
                          <h3 className="mb-0">
                            <strong>Senior Front-End Web Developer</strong> -
                            Rugby Australia
                          </h3>
                          <span className="text-sm italic mb-4 block">
                            June 2015 - February 2022
                          </span>
                          <p>
                            Shortly after starting at Rugby Australia as the
                            sole Front-End Developer, we kicked off a project
                            with Accenture to build{" "}
                            <a href="https://www.rugby.com.au" target="_blank">
                              www.rugby.com.au
                            </a>{" "}
                            in Sitecore. I worked closely both with internal
                            stakeholders and the Development team at Accenture
                            to ensure the project met all of our requirements,
                            was and within budget and delivered on time (before
                            the 2015 Rugby World Cup).
                          </p>
                          <p>
                            After the launch I took ownership of the site and
                            ran weekly sprint meetings with the Business Owners
                            and other stakeholders ensuring update requests were
                            clearly defined, prioritised and completed. A series
                            of enhancements were made, both to the public facing
                            site and back-end allowing our journalists to
                            operate efficinetly.
                          </p>
                          <p>
                            Throughout 2018 amd 2019 I was responsible for
                            building out an additional 22 sites on the same
                            framework (now known as the "Rugby Network"),
                            including sites for the Wallabies, Wallaroos, AU7s,
                            Super Rugby Clubs and Memeber Unions across
                            Australia. In addition to development, my role
                            involved working closely with stakeholders both
                            within Rugby Australia and each state and club to
                            ensure all requirements were met.
                          </p>
                          <p>
                            I am really proud of what I was able to accomplish
                            in this role, especially the significant improvement
                            that was made to Rugby's websites in Australia.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="sub-item">
                      <div className="sm:flex items-start">
                        <div className="w-20 flex-none float-right ml-2 sm:float-none sm:ml-0">
                          <Image
                            src="/assets/home/cornerstone-digital.png"
                            layout="intrinsic"
                            width="75"
                            height="75"
                            className="rounded-full"
                          />
                        </div>
                        <div className="pl-4">
                          <h3 className="mb-0">
                            <strong>Senior Front-End Web Developer</strong> -
                            Cornerstone Digital
                          </h3>
                          <span className="text-sm italic mb-4 block">
                            May 2010 - June 2015
                          </span>
                          <p className="mb-0">
                            My primary responsibilities included:
                          </p>
                          <ul className="list-disc">
                            <li>Website Development from PSD to Launch</li>
                            <li>Responsive and Fluid Development</li>
                            <li>Client Site Updates</li>
                            <li>CMS Integration and Client Training</li>
                            <li>Web Server Configuration</li>
                            <li>DNS Configuration</li>
                            <li>HTML Email Campaign Development</li>
                            <li>Contractor Management</li>
                            <li>Quoting on New Projects</li>
                            <li>Project Management</li>
                            <li>
                              Interviewing, Assessing and Training New Staff
                            </li>
                            <li>Client Training</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="sub-item">
                      <div className="sm:flex items-start">
                        <div className="pl-4">
                          <h2 className="text-lg md:text-xl font-bold md:pr-8">
                            Early Experience
                          </h2>
                          <ul className="list-disc md:ml-20">
                            <li>
                              <strong>Digital Resource Manager</strong> -
                              Rosshaven Design: <em>2009</em>
                            </li>
                            <li>
                              <strong>Freelance Web Developer</strong> - Skeefe
                              Systems: <em>2008-2009</em>
                            </li>
                            <li>
                              <strong>Web Developer</strong> - Simply Marketing
                              Group: <em>2007-2008</em>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
              <section id="education">
                <div className="content">
                  <div>
                    <h2 className="text-lg md:text-xl font-bold md:pr-8">
                      Education
                    </h2>
                    <div className="sub-item">
                      <div className="sm:flex items-start">
                        <div className="w-20 flex-none float-right ml-2 sm:float-none sm:ml-0">
                          <Image
                            src="/assets/home/capm.png"
                            layout="intrinsic"
                            width="75"
                            height="75"
                            className="rounded-full pl-5"
                          />
                        </div>
                        <div className="pl-4">
                          <h3 className="mb-0">
                            <strong>
                              <a
                                href="https://www.credly.com/badges/4be73cc2-56f5-41ed-9f10-7c505c6149ee?source=linked_in_profile"
                                target="_blank"
                              >
                                Certified Associate in Project Management (CAPM)
                                &reg;
                              </a>
                            </strong>
                            <br />
                            Project Management Institute (PMI)
                          </h3>
                          <span className="text-sm italic">
                            Issued Nov 2020
                          </span>
                          <p>
                            The CAPM is a globally recognised accreditation covering the following:</p>
                            <ul className="list-disc">
                              <li>Fundamentals of project management and the role of project managers</li>
                              <li>Project management environment, and project integration management</li>
                              <li>Project scope, schedule, cost, quality and resource management.</li>
                              <li>Project procurement, communication, stakeholder and risk management</li>
                            </ul>
                            <p>To prepare for the exam I completed the Project Management Basics course run by the Project Management Institute.</p>
                        </div>
                      </div>
                    </div>

                    <div className="sub-item">
                      <div className="sm:flex items-start">
                        <div className="w-20 flex-none float-right ml-2 sm:float-none sm:ml-0">
                          <Image
                            src="/assets/home/tafe.png"
                            layout="intrinsic"
                            width="75"
                            height="75"
                            className="rounded-full pl-5"
                          />
                        </div>
                        <div className="pl-4">
                          <h3 className="mb-0">
                            <strong>
                              Diploma (Distinction), Web Development
                            </strong>{" "}
                            - TAFE NSW
                          </h3>
                          <span className="text-sm italic">2007-2008</span>
                          <p>
                            Whilst a little outdated now 😊, this course gave me solid understanding of core Web Development principles which was crucial to my success in the first few years of my career. The major project in this course was to develop a custom eCommerce site in VB.NET which was awesome - "Well Red Books"!
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
            <div>
              <section id="projects">
                <div className="content">
                  <h2 className="text-lg md:text-xl font-bold md:pr-8">
                    Recent Projects
                  </h2>

                  <ul className="grid grid-cols-3 md:grid-cols-4 md:grid-cols-5 lg:grid-cols-4 xl:grid-cols-5 gap-8 gap-y-12 text-center">
                    {projects.map((project) => (
                      <ProjectPreview
                        key={project.title}
                        url={project.url}
                        title={project.title}
                        thumbnail={project.thumbnail}
                        company={project.company}
                        projectNumber={project.projectNumber}
                      />
                    ))}
                  </ul>
                </div>
              </section>

              <section id="contact">
                <div className="content">
                  <div>
                    <h2 className="text-lg md:text-xl font-bold md:pr-8">
                      Contact
                    </h2>
                    <form
                      action="https://mailthis.to/skeefe"
                      method="POST"
                    >
                      <input
                        type="hidden"
                        name="_subject"
                        value="Skeefe.net - Contact"
                      />

                      <input type="hidden" name="_honeypot" value="" />

                      <fieldset>
                        <div className="sm:flex mb-3">
                          <label
                            className="w-28 py-2 pr-2 block sm:inline-block"
                            htmlFor="name"
                          >
                            Name:
                          </label>
                          <input
                            id="name"
                            name="name"
                            placeholder="Enter your name."
                            type="text"
                            className="border p-2 w-full"
                            required
                          />
                        </div>

                        <div className="sm:flex mb-3">
                          <label
                            className="w-28 py-2 pr-2 block sm:inline-block"
                            htmlFor="email"
                          >
                            Email:
                          </label>
                          <input
                            id="email"
                            name="email"
                            placeholder="Enter your email address."
                            type="email"
                            className="border p-2  w-full"
                            required
                          />
                        </div>

                        <div className="sm:flex mb-3">
                          <label
                            className="w-28 py-2 pr-2 block sm:inline-block"
                            htmlFor="message"
                          >
                            Message:
                          </label>
                          <textarea
                            id="message"
                            name="message"
                            placeholder="Enter your message."
                            className="border p-2  w-full"
                            required
                          ></textarea>
                        </div>

                        <div className="text-right">
                          <button
                            className="w-full sm:w-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded"
                            type="submit"
                          >
                            Send Message
                          </button>
                        </div>
                      </fieldset>
                    </form>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </Container>
      </Layout>
    </>
  );
};

export default Index;

export const getStaticProps = async () => {
  const allProjects = getAllProjects([
    "title",
    "url",
    "thumbnail",
    "company",
    "projectNumber",
  ]);

  return {
    props: { allProjects },
  };
};
