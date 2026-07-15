let allJobs = [];

async function loadJobs() {

    try {

        const response =
            await fetch(
                "https://www.arbeitnow.com/api/job-board-api"
            );

        const data =
            await response.json();

        allJobs =
            data.data || [];

        renderJobs(allJobs);

        updateStats();

    } catch (error) {

        document.getElementById("jobs").innerHTML =
            "<h3>שגיאה בטעינת משרות</h3>";

        console.error(error);

    }

}

function renderJobs(jobs) {

    const container =
        document.getElementById("jobs");

    container.innerHTML = "";

    jobs.slice(0, 100).forEach(job => {

        const title =
            job.title || "";

        const company =
            job.company_name || "";

        const url =
            job.url || "#";

        const location =
            job.location || "Remote";

        container.innerHTML += `
        <div class="job">

            <h3>${title}</h3>

            <p>
                <strong>חברה:</strong>
                ${company}
            </p>

            <p>
                <strong>מיקום:</strong>
                ${location}
            </p>

            <p>
                <strong>Remote:</strong>
                ${job.remote ? "כן" : "לא"}
            </p>

            ${url}
                הגש מועמדות
            </a>

            <br>

            <button
                class="favorite"
                onclick="saveFavorite(
                    '${title.replace(/'/g,'')}',
                    '${company.replace(/'/g,'')}',
                    '${url}'
                )"
            >
                ⭐ שמור למועדפים
            </button>

        </div>
        `;
    });

}

function searchJobs() {

    const text =
        document
        .getElementById("searchInput")
        .value
        .toLowerCase();

    const filter =
        document
        .getElementById("categoryFilter")
        .value;

    let filtered =
        allJobs.filter(job =>
            (job.title || "")
            .toLowerCase()
            .includes(text)
        );

    if (filter === "remote") {

        filtered =
            filtered.filter(
                job => job.remote
            );

    }

    if (filter === "qa") {

        filtered =
            filtered.filter(job => {

                const t =
                    (job.title || "")
                    .toLowerCase();

                return (
                    t.includes("qa") ||
                    t.includes("automation") ||
                    t.includes("sdet") ||
                    t.includes("test")
                );

            });

    }

    renderJobs(filtered);

}

function saveFavorite(
    title,
    company,
    url
) {

    let favorites =
        JSON.parse(
            localStorage.getItem("favorites") || "[]"
        );

    const exists =
        favorites.find(
            item => item.url === url
        );

    if (exists) {
        return;
    }

    favorites.push({
        title,
        company,
        url
    });

    localStorage.setItem(
        "favorites",
        JSON.stringify(favorites)
    );

    renderFavorites();
    updateStats();

}

function removeFavorite(index) {

    let favorites =
        JSON.parse(
            localStorage.getItem("favorites") || "[]"
        );

    favorites.splice(index, 1);

    localStorage.setItem(
        "favorites",
        JSON.stringify(favorites)
    );

    renderFavorites();
    updateStats();

}

function renderFavorites() {

    const container =
        document.getElementById("favorites");

    const favorites =
        JSON.parse(
            localStorage.getItem("favorites") || "[]"
        );

    if (favorites.length === 0) {

        container.innerHTML =
            "<p>אין משרות שמורות</p>";

        return;

    }

    container.innerHTML = "";

    favorites.forEach((job, index) => {

        container.innerHTML += `
        <div class="favorite-card">

            <h3>${job.title}</h3>

            <p>${job.company}</p>

            <br>

            ${job.url}
                פתח משרה
            </a>

            <br><br>

            <button
                class="favorite"
                onclick="removeFavorite(${index})"
            >
                🗑 הסר מועדף
            </button>

        </div>
        `;

    });

}

function updateStats() {

    document.getElementById(
        "jobCount"
    ).innerText =
        allJobs.length;

    const favorites =
        JSON.parse(
            localStorage.getItem("favorites") || "[]"
        );

    document.getElementById(
        "favoriteCount"
    ).innerText =
        favorites.length;

}

function showFavoritesTab() {

    document.getElementById(
        "jobs"
    ).style.display =
        "none";

    document.getElementById(
        "favoritesSection"
    ).style.display =
        "block";

    document
        .getElementById("favoritesTab")
        .classList.add("active");

    document
        .getElementById("jobsTab")
        .classList.remove("active");

}

function showJobsTab() {

    document.getElementById(
        "jobs"
    ).style.display =
        "grid";

    document.getElementById(
        "favoritesSection"
    ).style.display =
        "none";

    document
        .getElementById("jobsTab")
        .classList.add("active");

    document
        .getElementById("favoritesTab")
        .classList.remove("active");

}

loadJobs();
renderFavorites();
showJobsTab();
