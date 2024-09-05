import { List, ListItem, ListItemText, ListItemAvatar, Avatar, Typography, Divider, Stack, Paper, Box } from '@mui/material';
import { useEffect, useState } from 'react';
import BottomTenPage from './BottomTenPage';
import TopTenPages from './TopTenPages';
import TableViewPagesDetails from './TableViewPagesDetails';

function CommunityReport({ rows, setRows, pagecategory, allRows, setReportView }) {
  console.log(rows, 'rows');
  const [teamCreated, setTeamCreated] = useState({ totalCor: 0, teamCount: 0 });
  const [zeroPostData, setZeroPostData] = useState([]);
  const [oneToFivePost, setOneToFivePost] = useState([]);
  const [fivePlusPost, setFivePlusPost] = useState([]);
  const [twentyPlusPost, setTwentyPlusPost] = useState([]);
  const [negativeFollowerDiff, setNegativeFollowerDiff] = useState([]);
  const [constantFollowerDiff, setConstantFollowerDiff] = useState([]);
  const [positiveFollowerDiff, setPositiveFollowerDiff] = useState([]);

  const groupByPageCategoryId = (rows) => {
    let grouped = {};
    rows.forEach(row => {
      let categoryId = row.projectxRecord.pageCategoryId;

      if (grouped[categoryId]) {
        grouped[categoryId].count++;
        grouped[categoryId].followersCount += row.creatorInfo.followersCount || 0;
        grouped[categoryId].todayPostCount += row.reportStatus.previousDay.todayPostCount || 0;
      } else {
        grouped[categoryId] = {
          count: 1,
          followersCount: row.creatorInfo.followersCount || 0,
          todayPostCount: row.reportStatus.previousDay.todayPostCount || 0
        };
      }
    });
    return grouped;
  };

  useEffect(() => {
    const zeroPostData = allRows.filter(row => row.reportStatus.previousDay.todayPostCount === 0);
    setZeroPostData(zeroPostData);
    const oneToFivePost = allRows.filter((record) => record.reportStatus.previousDay.todayPostCount > 0 && record.reportStatus.previousDay.todayPostCount < 6)
    setOneToFivePost(oneToFivePost)
    const FivePlusPost = allRows.filter((record) => record.reportStatus.previousDay.todayPostCount > 5 && record.reportStatus.previousDay.todayPostCount < 20)
    setFivePlusPost(FivePlusPost)
    const twentyPlusPost = allRows.filter((record) => record.reportStatus.previousDay.todayPostCount > 19)
    setTwentyPlusPost(twentyPlusPost)
    const negativeFollowerDiff = allRows.filter(row => row.reportStatus.previousDay.todayVsYesterdayFollowersCountDiff < 0);
    setNegativeFollowerDiff(negativeFollowerDiff);
    const constantFollowerDiff = allRows.filter(row => row.reportStatus.previousDay.todayVsYesterdayFollowersCountDiff == 0);
    setConstantFollowerDiff(constantFollowerDiff);
    const positivePostDiffRecords = allRows.filter(row => row.reportStatus.previousDay.todayVsYesterdayFollowersCountDiff > 0);
    setPositiveFollowerDiff(positivePostDiffRecords);
  }, [rows, allRows]);


  const groupedData = groupByPageCategoryId(rows);
  const totalFollowers = pagecategory.reduce((total, item) => {
    const countData = groupedData[item.category_id] || { count: 0, followersCount: 0, todayPostCount: 0 };
    if (countData.count > 0) {
      return total + countData.followersCount;
    }
    return total;
  }, 0);

  const totalPosts = pagecategory.reduce((total, item) => {
    const countData = groupedData[item.category_id] || { count: 0, followersCount: 0, todayPostCount: 0 };
    if (countData.count > 0) {
      return total + countData.todayPostCount;
    }
    return total;
  }, 0);

  const formatFollowersCount = (count) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    } else {
      return count.toString();
    }
  };

  useEffect(() => {
    const result = processRecords(allRows);
    setTeamCreated(result);
  }, [allRows]);

  const processRecords = (rows) => {
    let totalCor = 0;
    let teamCount = 0;
    let totalPaidPost = 0;
    rows.forEach((record) => {
      if (record.teamInfo?.team?.cost_of_running) {
        totalCor += record.teamInfo.team.cost_of_running;

        if (record.teamInfo.team.team_count > 0) {
          teamCount++;
        }
      }
      if (record.paidPosts?.count > 0) {
        totalPaidPost += record.paidPosts?.count;
      }
    });

    return {
      teamCount: teamCount,
    };
  };
  const handleZeroCount = () => {
    const ZeroPostCount = allRows.filter(
      (record) => record.reportStatus.previousDay.todayPostCount === 0
    );
    setRows(ZeroPostCount);
    setReportView(false);
  }
  const handleUnderFiveCount = () => {
    const oneToFivePost = allRows.filter((record) => record.reportStatus.previousDay.todayPostCount > 0 && record.reportStatus.previousDay.todayPostCount < 6)
    setRows(oneToFivePost);
    setReportView(false);
  }
  const handleUnderFivePlusCount = () => {
    const fivePlusPost = allRows.filter((record) => record.reportStatus.previousDay.todayPostCount > 5 && record.reportStatus.previousDay.todayPostCount < 20)
    setRows(fivePlusPost);
    setReportView(false);
  }
  const handleUnderTwentyPlusCount = () => {
    const twentyPlusPost = allRows.filter((record) => record.reportStatus.previousDay.todayPostCount > 19)
    setRows(twentyPlusPost);
    setReportView(false);
  }
  const handleNagetiveGrowth = () => {
    const nagetiveGrowth = allRows.filter(
      (record) => record.reportStatus.previousDay.todayVsYesterdayFollowersCountDiff < 0
    );
    setRows(nagetiveGrowth);
    setReportView(false);
  }
  const handleConstantGrowth = () => {
    const constantGrowth = allRows.filter(
      (record) => record.reportStatus.previousDay.todayVsYesterdayFollowersCountDiff == 0
    );
    setRows(constantGrowth);
    setReportView(false);
  }
  const handlePositiveGrowth = () => {
    const positiveGrowth = allRows.filter(
      (record) => record.reportStatus.previousDay.todayVsYesterdayFollowersCountDiff
        > 0
    );
    setRows(positiveGrowth);
    setReportView(false);
  }
  return (
    <div>
      <Stack direction="row" spacing={2} sx={{ width: '100%', alignItems: "flex-start" }}>
        <Stack sx={{ width: '50%', paddingRight: '10px' }}>
          <div className="card" style={{ background: '#33bfff2e' }}>
            <Typography variant="h6" sx={{ mt: 2, ml: 2, mb: 1 }}> All Category</Typography>
            <Paper sx={{ color: '#FF8D33' }} elevation={6}>
              <div className="card-body d-flex justify-content-between align-item-center" >
                <Typography >Followers: {formatFollowersCount(totalFollowers)}</Typography>
                <Typography >Posts: {totalPosts}</Typography>
              </div>
              <div className='ml-3 mb-2'> <h6>Team not created count - {allRows?.length - teamCreated?.teamCount}</h6></div>
            </Paper>
          </div>

          <Paper className="card" elevation={6}>
            <Typography sx={{ background: '#33bff2e', mt: 1, ml: 2 }}> Pages </Typography>
            <Box sx={{ display: 'flex', justifyContent: "space-around", color: '#FF8D33', mb: 1, mt: 1 }}>
              <Typography sx={{ color: '#FF8D33' }}> All - {allRows.length} </Typography>
              <Typography sx={{ color: '#FF8D33' }}> Active  - {allRows.filter(
                (record) => record.projectxRecord.page_status == 3
              ).length} </Typography>
              <Typography sx={{ color: '#FF8D33' }}> Disabled - {allRows.filter(
                (record) => record.projectxRecord.page_status == 2
              ).length}  </Typography>
              <Typography sx={{ color: '#FF8D33' }}> Private - {allRows.filter(
                (record) => record.projectxRecord.page_status == 1
              ).length}  </Typography>
            </Box>
          </Paper>

          {pagecategory.map((item, index) => {
            let countData = groupedData[item.category_id] || { count: 0, followersCount: 0, todayPostCount: 0 };

            return (
              <div key={index}>
                {countData.count > 0 && (
                  <List sx={{ bgcolor: 'background.paper' }}>
                    <ListItem alignItems="flex-start">
                      <ListItemAvatar>
                        <Avatar alt={item.category_name} src='n' />
                      </ListItemAvatar>
                      <ListItemText
                        primary={`${item.category_name} - Pages: ${countData.count}`}
                        secondary={
                          <>
                            <Typography sx={{ display: 'inline' }} >
                              Followers: {formatFollowersCount(countData.followersCount)} | Today Post: {countData.todayPostCount}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                    <Divider variant="inset" component="li" />
                  </List>
                )}
              </div>
            );
          })}

        </Stack>
        <Stack sx={{ width: '50%' }}>
          <div className="card" style={{ background: '#33bfff2e' }}>
            <Typography sx={{ mt: 1, ml: 2 }}> Pages with Post </Typography>
            <Box className="card-body" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <div> 0  <button className="btn btn-outline-danger rounded-3" style={{ borderColor: '#d17c64' }} onClick={() => handleZeroCount()} >   {zeroPostData.length}</button></div>
              <div> 1 - 5  <button className="btn btn-outline-danger rounded-3 " style={{ borderColor: '#d17c64' }} onClick={() => handleUnderFiveCount()} >   {oneToFivePost.length}</button></div>
              <div> 5 - 20  <button className="btn btn-outline-danger rounded-3 " style={{ borderColor: '#d17c64' }} onClick={() => handleUnderFivePlusCount()} >   {fivePlusPost.length}</button></div>
              <div> 20+  <button className="btn btn-outline-danger rounded-3 " style={{ borderColor: '#d17c64' }} onClick={() => handleUnderTwentyPlusCount()} >   {twentyPlusPost.length}</button></div>
            </Box>
            <Paper sx={{ color: '#FF8D33' }} elevation={6}>
              <h5 className='ml-4 mt-2'> Follower Growth</h5>
              <div className='d-flex justify-content-between ml-4 mr-2 mb-2'>
                <div> Negative   <button className="btn btn-outline-danger rounded-3" style={{ borderColor: '#d17c64' }} onClick={() => handleNagetiveGrowth()} >   {negativeFollowerDiff.length}</button></div>
                <div> Constant   <button className="btn btn-outline-danger rounded-3" style={{ borderColor: '#d17c64' }} onClick={() => handleConstantGrowth()}>   {constantFollowerDiff.length}</button></div>
                <div> Positive   <button className="btn btn-outline-danger rounded-3" style={{ borderColor: '#d17c64' }} onClick={() => handlePositiveGrowth()}>   {positiveFollowerDiff.length}</button></div>
              </div>
            </Paper>
          </div>
          <TopTenPages rows={rows} allRows={allRows} />
          <BottomTenPage rows={rows} allRows={allRows} />
        </Stack>
      </Stack>
    </div>
  );
}

export default CommunityReport;
