import "./onboardcss/onboard_style.css";
import "./onboardcss/onboard_responsive.css";
import "./onboardcss/onboard_animate.min.css";

const FAQTab = ({ username, designation }) => {
  return (
    <>
      <div className="cardBoard">
        <div className="cardBodyBoard">
          <div className="policyarea">
            <div className="thm_texthead">
              <h2 className="text-center">FAQ (Frequently Asked Questions)</h2>
              <div className="thm_textarea">
                <div className="thm_textbx">
                  <h3>1. When Was the Company Founded?</h3>
                  <p>
                    Creativefuel ignited its journey on December 17, 2020. Since
                    then, we’ve been fueling innovation and shaping the future
                    of marketing. Join us as we continue to blaze new trails and
                    make an impact!
                  </p>
                </div>
                <div className="thm_textbx">
                  <h3>2. Who Are the Dynamic Duo Leading the Company?</h3>
                  <p>
                    Meet our visionary leaders, Nikhil Sukhramani and Tushar
                    Sukhramani, who serve as the Director and CEO of
                    Creativefuel. Together, they light the way with their
                    innovative thinking and strategic insight, guiding us to new
                    heights and shaping the future of marketing.
                  </p>
                </div>
                <div className="thm_textbx">
                  <h3>3. What Is the Salary Cycle?</h3>
                  <p>
                    At Creativefuel, we keep things simple and consistent. Our
                    salary cycle flows smoothly from the 26th of one month to
                    the 25th of the next. We count every day—30 or 31—ensuring
                    that your efforts are recognized without skipping a beat.
                  </p>
                </div>
                <div className="thm_textbx">
                  <h3>4. How Long Is the Notice Period?</h3>
                  <p>
                    Planning a new adventure? Just remember, when it's time to
                    say goodbye, a 60-day notice period gives us all time to
                    wrap things up neatly.
                  </p>
                </div>
                <div className="thm_textbx">
                  <h3>5. What Is the Notice Period During Probation?</h3>
                  <p>
                    Still testing the waters? If you're on probation, a quick
                    7-day notice is all it takes to part ways.
                  </p>
                </div>
                <div className="thm_textbx">
                  <h3>6. Can I Take Paid Leave During My Probation?</h3>
                  <p>
                    Yes! After three months of proving your mettle, you're free
                    to take some well-deserved paid leave during your probation
                    period.
                  </p>
                </div>
                <div className="thm_textbx">
                  <h3>7. What’s the Purpose of the Onboarding Process?</h3>
                  <p>
                    Our onboarding process is your backstage pass to the world
                    of Creativefuel. We’re here to welcome you, show you the
                    ropes, and equip you with everything you need to shine in
                    your new role.
                  </p>
                </div>
                <div className="thm_textbx">
                  <h3>8. When Is Performance Evaluation Conducted?</h3>
                  <p>
                    January is your time to shine! Our performance evaluations
                    set the stage for growth, and if you're due for a raise,
                    you'll see it reflected starting in February.
                  </p>
                </div>
                <div className="thm_textbx">
                  <h3>9. What Are the Standard Working Hours?</h3>
                  <p>
                    Our workday is balanced—8 hours of productivity, plus 1 hour
                    to recharge with a lunch break. It’s a rhythm that keeps
                    creativity flowing.
                  </p>
                </div>
                <div className="thm_textbx">
                  <h3>
                    10. What Are the Requirements for Working from Home (WFH)?
                  </h3>
                  <p>
                    Need a change of scenery? Just get prior approval before
                    switching to WFH mode. Remember, it’s considered half-day
                    attendance, so your pay will reflect that with 50% of your
                    salary for the day.
                  </p>
                </div>
                <div className="thm_textbx">
                  <h3>
                    11. What Is the Official Email for Queries or Feedback?
                  </h3>
                  <p>
                    Got talent acquisition in mind? Drop a line to{" "}
                    <a
                      style={{ color: "blue" }}
                      href="mailto:hr@creativefuel.io"
                    >
                      hr@creativefuel.io
                    </a>
                    . For all other HR-related queries—like payroll, leave, or
                    reimbursements—reach out to{" "}
                    <a
                      style={{ color: "blue" }}
                      href="mailto:fabhr@creativefuel.io"
                    >
                      fabhr@creativefuel.io
                    </a>
                    . And don’t forget to keep{" "}
                    <a
                      style={{ color: "blue" }}
                      href="mailto:nikhil@creativefuel.io"
                    >
                      nikhil@creativefuel.io
                    </a>
                    ,{" "}
                    <a
                      style={{ color: "blue" }}
                      href="mailto:tushar@creativefuel.io"
                    >
                      tushar@creativefuel.io
                    </a>
                    , and your team leader in the loop.
                  </p>
                </div>
                <div className="thm_textbx">
                  <h3>
                    12. Who Should I Contact for Technical Issues with the HRMS
                    Software?
                  </h3>
                  <p>
                    Got a glitch or a hiccup with the HRMS software? Drop our IT
                    support team a line at{" "}
                    <a
                      style={{ color: "blue" }}
                      href="mailto:fabhr@creativefuel.io"
                    >
                      fabhr@creativefuel.io
                    </a>
                    . For a speedy fix, make sure to provide all the juicy
                    details about the issue!
                  </p>
                </div>
                <div className="thm_textbx">
                  <h3>13. What Should I Do If I Forget to Clock In or Out?</h3>
                  <p>
                    Oops, missed clocking in or out? No worries! Just give your
                    team leader and HR a quick heads-up. They’ll help sort out
                    your attendance records without a hitch.
                  </p>
                </div>
                <div className="thm_textbx">
                  <h3>
                    14. What Happens If I Have Unused Paid Leave at the End of
                    the Year?
                  </h3>
                  <p>
                    Got some leftover paid leave at year-end? You’re in luck!
                    Any unused leave will roll over into the new year. So, if
                    you’ve got 5 days left and receive 12 new days, you’ll kick
                    off the new year with a total of 17 paid leave days. Talk
                    about a fresh start!
                  </p>
                </div>
                <div className="thm_textbx">
                  <h3>15. How Can I Access Company Policies and Guidelines?</h3>
                  <p>
                    When you join the team, you’ll get an email packed with your
                    Code of Conduct and training materials. These documents will
                    be your go-to for everything you need to know about our
                    company policies and guidelines.
                  </p>
                </div>
                <div className="thm_textbx">
                  <h3>16. Who Do I Contact for Payroll Discrepancies?</h3>
                  <p>
                    Spot an error in your paycheck? Don’t stress—just shoot an
                    email to HR at{" "}
                    <a
                      style={{ color: "blue" }}
                      href="mailto:fabhr@creativefuel.io"
                    >
                      fabhr@creativefuel.io
                    </a>
                    . Share the details of the discrepancy, and they’ll work
                    their magic to get it resolved quickly.
                  </p>
                </div>
                <div className="thm_textbx">
                  <h3>
                    17. What Should I Do If I Experience Workplace Harassment?
                  </h3>
                  <p>
                    If you encounter or witness any form of workplace
                    harassment, it's crucial to speak up. Report it directly to
                    HR at{" "}
                    <a
                      style={{ color: "blue" }}
                      href="mailto:fabhr@creativefuel.io"
                    >
                      fabhr@creativefuel.io
                    </a>
                    . Your report will be handled confidentially and
                    investigated promptly to ensure a safe and respectful work
                    environment.
                  </p>
                </div>
                <div className="thm_textbx">
                  <h3>
                    18. What Should I Do If I Need to Update My Bank Details?
                  </h3>
                  <p>
                    Got a new bank account? No sweat! Just shoot an email to HR
                    at{" "}
                    <a
                      style={{ color: "blue" }}
                      href="mailto:fabhr@creativefuel.io"
                    >
                      fabhr@creativefuel.io
                    </a>{" "}
                    with your updated details. Make sure to do this before the
                    next payroll cycle so your paycheck lands smoothly in the
                    right account. We’ve got you covered for a hassle-free
                    payday!
                  </p>
                </div>
                <div className="thm_textbx">
                  <h3>19. What Is the Process for Grievance Redressal?</h3>
                  <p>
                    Got something on your mind that needs a fix? We’ve got you
                    covered! Just send an email to HR at{" "}
                    <a
                      style={{ color: "blue" }}
                      href="mailto:fabhr@creativefuel.io"
                    >
                      fabhr@creativefuel.io
                    </a>{" "}
                    and don’t forget to CC{" "}
                    <a
                      style={{ color: "blue" }}
                      href="mailto:pallavi@creativefuel.io"
                    >
                      pallavi@creativefuel.io
                    </a>
                    . Our structured grievance redressal process is here to
                    ensure your concerns are tackled with speed and fairness.
                    Your feedback is crucial, and we’re dedicated to resolving
                    any issues with care and clarity.
                  </p>
                </div>
                <div className="thm_textbx">
                  <h3>20. How Does the Company Handle Employee Discipline?</h3>
                  <p>
                    At Creativefuel, we take a thoughtful approach to
                    discipline, aimed at nurturing improvement rather than just
                    enforcing rules. Our progressive discipline policy starts
                    with friendly reminders and escalates through formal written
                    warnings if needed. And, if all else fails, we’ll consider
                    termination as a last resort. The ultimate goal is to guide
                    you towards success while maintaining a positive and upbeat
                    work environment. We’re here to support and help everyone
                    thrive!
                  </p>
                </div>
                <div className="thm_textbx">
                  <h3>21. What Are the Guidelines for Employee Conduct?</h3>
                  <p>
                    Curious about how to shine at Creativefuel? Our Code of
                    Conduct is your ultimate guide to stellar behavior. It
                    covers everything from keeping it professional to acting
                    with integrity. Think of it as your roadmap to rocking the
                    workplace!
                  </p>
                </div>
                <div className="thm_textbx">
                  <h3>22. What Are the Termination Procedures?</h3>
                  <p>
                    If it’s time to say goodbye, we’ve got a smooth and clear
                    process in place. You’ll get a formal notice, and our HR
                    team will be by your side, guiding you through final
                    settlements and returning any company gear. We’re here to
                    make your exit as seamless as your journey with us.
                  </p>
                </div>
                <div className="thm_textbx">
                  <h3>
                    23. What Should I Do If I Suspect a Violation of Company
                    Policies?
                  </h3>
                  <p>
                    Think you’ve spotted a policy breach? Don’t keep it under
                    wraps! Reach out to HR at{" "}
                    <a
                      style={{ color: "blue" }}
                      href="mailto:fabhr@creativefuel.io"
                    >
                      fabhr@creativefuel.io
                    </a>{" "}
                    with your concerns. We’ll dive into a thorough investigation
                    and take the right steps to address the issue. Your
                    vigilance helps keep our workplace running smoothly and
                    ethically!
                  </p>
                </div>
                <div className="thm_textbx">
                  <h3>
                    24. What Should I Do If Something Happens to a Company
                    Asset?
                  </h3>
                  <p>
                    If a company asset takes a tumble or encounters trouble,
                    don’t try to fix it yourself—leave it to the pros! Contact
                    HR right away and report the issue. We’ll guide you through
                    the next steps and handle the repair or replacement. Just
                    pass on the damaged asset to us, and we’ll take care of the
                    rest!
                  </p>
                </div>
                <div className="thm_textbx">
                  <h3>
                    25. How Are Employee Birthdays and Anniversaries Celebrated?
                  </h3>
                  <p>
                    Get ready for a double dose of celebration! On your birthday
                    and work anniversary, we gift you a paid leave to make the
                    day all about you. Whether it’s cake, adventures, or simply
                    relaxing with loved ones, take the day off and bask in the
                    spotlight—because you’ve earned it!
                  </p>
                </div>
                <div className="thm_textbx">
                  <h3>26. What Awaits You on Your First Day with Us?</h3>
                  <p>
                    New hires can look forward to a meme-tastic onboarding
                    experience, a welcoming first-day lunch, and a great goodies
                    kit. The documentation process will be short and
                    straightforward. You'll also engage in dynamic learning
                    during the induction and get introduced to your team to
                    showcase your talents.
                  </p>
                </div>
                <div className="thm_textbx">
                  <h3>27. How Many Paid Leave Days Can I Use Each Month?</h3>
                  <p>
                    You’ve got a maximum of 3 paid leaves to play with each
                    month, all from your annual stash of 12 days. So, take a
                    breather and make the most of your well-deserved time off!
                  </p>
                </div>
                <div className="thm_textbx">
                  <h3>28. Who Will Be on My Radar as Key Contacts?</h3>
                  <p>
                    As a new hire, you’ll regularly connect with the HR squad,
                    your immediate team, and other key departments. If there’s a
                    special meeting or new face you need to know about, we’ll
                    give you a heads-up so you’re always in the loop!
                  </p>
                </div>
                <div className="thm_textbx">
                  <h3>
                    29. Are There Team-Building Activities or Social Events?
                  </h3>
                  <p>
                    Absolutely! We love bringing our team together for
                    fun-filled team-building activities and social events. These
                    gatherings are perfect for bonding, building relationships,
                    and sparking new collaborations. Get ready to connect,
                    laugh, and make lasting memories!
                  </p>
                </div>
                <div className="thm_textbx">
                  <h3>
                    30. What Happens If I Engage in Illegal Activities or
                    Violate Company Bylaws?
                  </h3>
                  <p>
                    When you join, you'll sign a Non-Disclosure Agreement (NDA).
                    If you engage in illegal activities or breach company
                    bylaws, actions will be taken as per the NDA, which may
                    include termination of your employment.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FAQTab;
