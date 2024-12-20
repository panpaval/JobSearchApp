const appId = "2ded0931";
const apiKey = "81aeac5d29b3f6d9c79e0f84852c2ce3";
const baseUrl = "https://api.adzuna.com/v1/api/jobs";

export async function getJobById(id, params) {
  const country = params?.country || "us";

  const url = `${baseUrl}/${country}/search/1?app_id=${appId}&app_key=${apiKey}&what_and=${id}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch job");
    }
    const data = await response.json();
    return data.results[0];
  } catch (error) {
    console.error("Error fetching job by id:", error);
    throw error;
  }
}

export async function requestIndustryName(params) {
  const country = params?.filters?.country || params?.country || "us";
  let url = `${baseUrl}/${country}/categories?app_id=${appId}&app_key=${apiKey}`;

  try {
    const response = await fetch(
      url /* {
        mode: 'no-cors'
      } */
    );

    if (!response.ok) {
      throw Error("Error!");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}
//не используем, захардкодили в regionData.js
export async function requestLocations(params) {
  const country = params?.filters?.country || params?.country || "us";
  const url = `${baseUrl}/${country}/geodata?app_id=${appId}&app_key=${apiKey}`;

  try {
    const response = await fetch(
      url /* , {
      mode: "no-cors",
    } */
    );

    if (!response.ok) {
      throw new Error("Failed to fetch locations");
    }

    const data = await response.json();
    return data.locations;
  } catch (error) {
    console.error("Error fetching locations:", error);
    throw error;
  }
}

export async function request(params, keyword, page) {
  if (!page) {
    page = 1;
  }
  const country = params?.country || "us";

  let url = `${baseUrl}/${country}/search/${page}?app_id=${appId}&app_key=${apiKey}&results_per_page=20`;

  if (keyword) {
    url += `&what=${keyword}`;
  }

  if (params && params.industry) {
    url += `&category=${params.industry}`;
  }

  if (params && params.salaryMin) {
    url += `&salary_min=${params.salaryMin}`;
  }

  if (params && params.salaryMax) {
    url += `&salary_max=${params.salaryMax}`;
  }

  // Добавляем параметр where для региона
  if (params && params.region) {
    url += `&where=${encodeURIComponent(params.region)}`;
  }

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw Error("Error!");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}
