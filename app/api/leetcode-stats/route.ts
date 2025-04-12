import { NextResponse } from 'next/server'

export async function GET() {
  const username = "Ayushraj009" // Replace with your LeetCode username

  const query = `
    query getUserProfile($username: String!) {
      matchedUser(username: $username) {
        profile {
          ranking
        }
        submitStats {
          acSubmissionNum {
            difficulty
            count
          }
        }
      }
    }
  `

  const res = await fetch("https://leetcode.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      variables: { username },
    }),
  })

  const data = await res.json()

  // Ensure we handle potential errors in the data response
  if (!data.data || !data.data.matchedUser) {
    return NextResponse.json({ error: "User data not found or invalid response" })
  }

  const user = data.data.matchedUser
  const ranking = user.profile.ranking || "Not available"
  
  const acSubmissionNum = user.submitStats.acSubmissionNum

  const easy = acSubmissionNum.find((item: any) => item.difficulty === "Easy")?.count || 0
  const medium = acSubmissionNum.find((item: any) => item.difficulty === "Medium")?.count || 0
  const hard = acSubmissionNum.find((item: any) => item.difficulty === "Hard")?.count || 0

  const totalSolved = easy + medium + hard

  return NextResponse.json({
    leetcodeRanking: `#${ranking}`,
    totalSolved,
    easy,
    medium,
    hard,
    easyPercentage: totalSolved ? Math.round((easy / totalSolved) * 100) : 0,
    mediumPercentage: totalSolved ? Math.round((medium / totalSolved) * 100) : 0,
    hardPercentage: totalSolved ? Math.round((hard / totalSolved) * 100) : 0,
  })
}
