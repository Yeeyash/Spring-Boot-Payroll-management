document.addEventListener("DOMContentLoaded", function() {
    // --- Sample Data ---
    const allTeamData = [
        {
            name: "Sarah Smith",
            qualification: "B.E.",
            rating: 4,
            reviews: 12342,
            description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer...",
            imageUrl: "https://placehold.co/100x100/E2E8F0/4A5568?text=SS",
            location: "Shanti Nagar Bldg No B 4, Sector No 6, Mira Road",
            twitter: "sarah_smith",
            phone: "123456789",
            email: "sarah@example.com"
        },
        {
            name: "Jay Soni",
            qualification: "Computer Science",
            rating: 3,
            reviews: 6545,
            description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer...",
            imageUrl: "https://placehold.co/100x100/E2E8F0/4A5568?text=JS",
            location: "Shanti Nagar Bldg No B 4, Sector No 6, Mira Road",
            twitter: "jay_soni",
            phone: "123456789",
            email: "jay@example.com"
        },
        {
            name: "Megha Trivedi",
            qualification: "M.C.A.",
            rating: 5,
            reviews: 15890,
            description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer...",
            imageUrl: "https://placehold.co/100x100/E2E8F0/4A5568?text=MT",
            location: "Shanti Nagar Bldg No B 4, Sector No 6, Mira Road",
            twitter: "megha_trivedi",
            phone: "123456789",
            email: "megha@example.com"
        }
    ];

    const container = document.getElementById('team-list-container');

    const generateStars = (rating) => {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars += '<span class="star-filled">&#9733;</span>'; // Filled star
            } else {
                stars += '<span class="star-empty">&#9733;</span>'; // Empty star
            }
        }
        return stars;
    };

    const renderTeamList = () => {
        container.innerHTML = '';
        allTeamData.forEach(member => {
            const card = document.createElement('div');
            card.className = 'bg-white rounded-xl shadow-sm p-6 flex flex-col md:flex-row gap-6';

            card.innerHTML = `
                <!-- Left Side: Profile Info -->
                <div class="flex-shrink-0 w-full md:w-1/4 flex flex-col items-center text-center">
                    <img src="${member.imageUrl}" alt="${member.name}" class="w-24 h-24 rounded-lg mb-4">
                </div>
                
                <!-- Middle: Details -->
                <div class="flex-grow">
                    <h3 class="text-xl font-bold text-blue-600">${member.name}</h3>
                    <p class="text-sm text-gray-500 mb-2">${member.qualification}</p>
                    <div class="flex items-center gap-2 mb-3">
                        <div class="star-rating">${generateStars(member.rating)}</div>
                        <span class="text-sm font-semibold">${member.rating}</span>
                        <span class="text-sm text-gray-500">(${member.reviews} ratings)</span>
                    </div>
                    <p class="text-sm text-gray-600 leading-relaxed">${member.description}</p>
                </div>
                
                <!-- Right Side: Contact Info -->
                <div class="w-full md:w-1/3 border-t md:border-t-0 md:border-l border-gray-200 pt-6 md:pt-0 md:pl-6 space-y-3 text-sm">
                    <div class="flex items-start gap-3">
                        <i data-lucide="map-pin" class="w-4 h-4 text-gray-500 mt-1"></i>
                        <span class="text-gray-700">${member.location}</span>
                    </div>
                    <div class="flex items-center gap-3">
                        <i data-lucide="twitter" class="w-4 h-4 text-gray-500"></i>
                        <span class="text-gray-700">${member.twitter}</span>
                    </div>
                    <div class="flex items-center gap-3">
                        <i data-lucide="phone" class="w-4 h-4 text-gray-500"></i>
                        <span class="text-gray-700">${member.phone}</span>
                    </div>
                    <div class="flex items-center gap-3">
                        <i data-lucide="mail" class="w-4 h-4 text-gray-500"></i>
                        <span class="text-gray-700">${member.email}</span>
                    </div>
                </div>
            `;
            container.appendChild(card);
        });
        lucide.createIcons();
    };

    // Initial Load
    renderTeamList();
});
