import React, { useState } from "react";
import { format, differenceInDays, addDays } from "date-fns";
import {
  useGetAllPlanXDataQuery,
  useGetPlanWiseDataQuery,
} from "../../Store/API/Operation/OperationApi";
import Calender from "./Calender";
import CategoryWiseDistribution from "./CategoryWiseDistribution";

const initialSteps = [
  {
    step: 1,
    category: "Sarcasm",
    posCount: 160,
    pages: [
      {
        username: "SarcasmLol",
        postCount: 15,
        creator_follower_count: "2000000",
      },
      {
        username: "Sarcastic_us",
        postCount: 7,
        creator_follower_count: "500000",
      },
      { username: "Sadcasm", postCount: 5, creator_follower_count: "1000" },
      { username: "Sadcasm.og", postCount: 5, creator_follower_count: "70000" },
    ],
  },
  {
    step: 2,
    category: "Meme",
    posCount: 140,
    pages: [
      { username: "Rvcjinsta", postCount: 5 },
      { username: "Comedyculture", postCount: 5 },
      { username: "Trolls_Official", postCount: 3 },
      { username: "Ghantaa", postCount: 10 },
    ],
  },
];

const OpCalender = () => {
  const [selectPlan, setSelectPlan] = useState(null);
  const { data: PlanX } = useGetAllPlanXDataQuery();
  const { data: planWiseData } = useGetPlanWiseDataQuery(
    { selectPlan },
    { skip: !selectPlan }
  );

  const [steps, setSteps] = useState(initialSteps);
  const [selectedStep, setSelectedStep] = useState(0);
  console.log(steps, "steps");
  console.log(selectedStep, "selectedsteps");
  const [dates, setDates] = useState([]);
  const [postCounts, setPostCounts] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [overviewData, setOverviewData] = useState({});

  const groupedData = planWiseData?.reduce((acc, item) => {
    const category = item.page_category_name || "Unknown";
    if (!acc[category]) {
      acc[category] = { count: 0, items: [] };
    }
    acc[category].count += 1; // Increment count
    acc[category].items.push(item); // Add item to category group
    return acc;
  }, {});

  const handleStepChange = (stepIndex) => {
    setSelectedStep(stepIndex);
  };

  const handleSelectPlan = (selectedOption) => {
    setSelectPlan(selectedOption);
  };

  const handleCategoryClick = (category, items) => {
    // Group items by username and calculate the postCount while keeping followerCount per user
    const groupedPages = items.reduce((acc, item) => {
      const username = item.creator_name || "Unknown";
      const followerCount = item.creator_follower_count || 0; // Default to 0 if not available

      if (acc[username]) {
        acc[username].postCount += 1; // Increment the postCount
        // Keep the follower count as is (do not add)
      } else {
        acc[username] = {
          username,
          postCount: 1,
          followerCount, // Store the follower count once
        };
      }

      return acc;
    }, {});

    const groupedPagesArray = Object.values(groupedPages);

    // Calculate the total post count as the sum of all pages' postCounts
    const totalPostCount = groupedPagesArray.reduce(
      (acc, page) => acc + page.postCount,
      0
    );

    const newSteps = [
      {
        category,
        posCount: totalPostCount,
        pages: groupedPagesArray, // Contains username, postCount, and followerCount
      },
    ];

    setSteps(newSteps);
    setSelectedStep(0);
  };

  const handleDatePostCountChange = (pageIndex, dateIndex, value) => {
    const updatedPostCounts = [...postCounts];
    const newCount = parseInt(value, 10) || 0;

    // Update the specific date count
    updatedPostCounts[selectedStep][pageIndex][dateIndex] = newCount;

    // Update the total count for the page and step
    const pageTotal = updatedPostCounts[selectedStep][pageIndex].reduce(
      (sum, count) => sum + count,
      0
    );
    const updatedSteps = [...steps];
    updatedSteps[selectedStep].pages[pageIndex].postCount = pageTotal;
    updatedSteps[selectedStep].posCount = updatedSteps[
      selectedStep
    ].pages.reduce((total, page) => total + page.postCount, 0);

    setPostCounts(updatedPostCounts);
    setSteps(updatedSteps);
  };

  const generateDates = (start, end) => {
    const daysCount = differenceInDays(end, start) + 1;
    const generatedDates = Array.from({ length: daysCount }, (_, i) => {
      const date = addDays(start, i);
      return format(date, "d MMM EEE");
    });
    setDates(generatedDates);

    const updatedCounts = steps.map((step, stepIndex) => {
      if (stepIndex === selectedStep) {
        return step.pages.map((page) => {
          const postsPerDay = Math.floor(page.postCount / daysCount);
          const remainingPosts = page.postCount % daysCount;

          const distribution = Array(daysCount).fill(postsPerDay);
          for (let i = 0; i < remainingPosts; i++) {
            distribution[i] += 1;
          }
          return distribution;
        });
      }
      return postCounts[stepIndex] || [];
    });

    const updatedOverview = {
      ...overviewData,
      [selectedStep]: updatedCounts[selectedStep],
    };
    setPostCounts(updatedCounts);
    setOverviewData(updatedOverview);
  };

  const resetCalendar = () => {
    setDates([]);
    setPostCounts([]);
    setStartDate(null);
    setEndDate(null);
  };

  const getDailyTotals = () => {
    return dates.map((_, dateIndex) =>
      (postCounts[selectedStep] || []).reduce(
        (total, pageCounts) => total + pageCounts[dateIndex],
        0
      )
    );
  };

  const dailyTotals = getDailyTotals();

  const addDate = (date) => {
    const formattedDate = format(date, "d MMM");
    if (!dates.includes(formattedDate)) {
      setDates((prev) => {
        const updatedDates = [...prev, formattedDate];
        generatePostCountsForNewDate(updatedDates); // Generate post counts based on updated dates
        return updatedDates;
      });
    }
  };
  const generatePostCountsForNewDate = (updatedDates) => {
    const daysCount = updatedDates.length;
    const updatedCounts = steps.map((step, stepIndex) => {
      if (stepIndex === selectedStep) {
        return step.pages.map((page) => {
          const postsPerDay = Math.floor(page.postCount / daysCount);
          const remainingPosts = page.postCount % daysCount;

          const distribution = Array(daysCount).fill(postsPerDay);
          for (let i = 0; i < remainingPosts; i++) {
            distribution[i] += 1;
          }
          return distribution;
        });
      }
      return postCounts[stepIndex] || [];
    });

    const updatedOverview = {
      ...overviewData,
      [selectedStep]: updatedCounts[selectedStep],
    };

    setPostCounts(updatedCounts);
    setOverviewData(updatedOverview);
  };

  return (
    <>
      <CategoryWiseDistribution
        PlanX={PlanX}
        groupedData={groupedData}
        handleSelectPlan={handleSelectPlan}
        handleCategoryClick={handleCategoryClick}
      />

      {steps.length > 0 ? (
        <Calender
          generateDates={generateDates}
          handleStepChange={handleStepChange}
          handleDatePostCountChange={handleDatePostCountChange}
          steps={steps}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          resetCalendar={resetCalendar}
          dates={dates}
          selectedStep={selectedStep}
          dailyTotals={dailyTotals}
          overviewData={overviewData}
          postCounts={postCounts}
          addDate={addDate}
        />
      ) : (
        <h2 style={{ textAlign: "center" }}>Please select a plan first.</h2>
      )}
    </>
  );
};

export default OpCalender;
