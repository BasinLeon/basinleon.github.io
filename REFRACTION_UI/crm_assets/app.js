$(document).ready(function() {
    // UI Elements
    const loadingOverlay = $('#loading-overlay');
    const loadingText = $('#loading-text');
    const sidebar = $('#lead-details-sidebar');
    const sidebarContent = $('#sidebar-content');
    const csvFile = 'leads_enriched_final.csv';

    // Global variable for easier close access
    window.closeSidebar = function() {
        sidebar.removeClass('open');
        $('.selected-row').removeClass('selected-row');
    };

    Papa.parse(csvFile, {
        download: true,
        header: true,
        skipEmptyLines: true,
        complete: function(results) {
            const data = results.data;
            if (!data || data.length === 0) {
                 loadingText.html("Engine Idle.<br><span style='font-size:0.8rem'>Start enrichment to see signals</span>");
                 return;
            }
            const validData = data.filter(row => row['Full Name'] && row['Full Name'].trim() !== '');
            initializeDashboard(validData);
            setTimeout(() => { loadingOverlay.addClass('hidden'); }, 800);
        },
        error: function(err) {
            loadingText.html(`<h3>Nexus Link Failure</h3>`);
        }
    });

    function initializeDashboard(data) {
        // Calculations
        animateValue("stat-total", 0, data.length, 1000);
        const enriched = data.filter(r => r['Enrichment Source'] && r['Enrichment Source'] !== 'none').length;
        animateValue("stat-enriched", 0, enriched, 1000);
        const highPriority = data.filter(r => parseInt(r['GTM Score']) >= 40).length;
        animateValue("stat-priority", 0, highPriority, 1000);
        const pitches = data.filter(r => r['Nexus Pitch'] && r['Nexus Pitch'].includes('🦅')).length;
        animateValue("stat-outreach", 0, pitches, 1000);

        const table = $('#leads-table').DataTable({
            data: data,
            columns: [
                { 
                    data: 'Full Name', 
                    title: 'LEAD',
                    render: (data, type, row) => `
                        <div class="d-flex align-items-center">
                            <div class="avatar-circle me-3" style="width:32px;height:32px;background:linear-gradient(135deg,#6366f1,#8b5cf6);border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:0.8rem">${(data||'?').charAt(0)}</div>
                            <div>
                                <div style="font-weight:600">${data || 'Unknown'}</div>
                                <div style="font-size:0.7rem; color:#94a3b8">${row['Email'] || 'no-email'}</div>
                            </div>
                        </div>` 
                },
                { 
                    data: 'Company', 
                    title: 'COMPANY',
                    render: (data, type, row) => `
                        <div style="font-weight:500">${data || 'Unknown'}</div>
                        <span style="font-size:0.7rem; color:#6366f1">${row['Website'] || ''}</span>` 
                },
                { 
                    data: 'Title',
                    title: 'ROLE',
                    render: (data) => `<div style="max-width:150px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; font-size:0.8rem; opacity:0.8" title="${data}">${data || '-'}</div>`
                },
                { 
                    data: 'GTM Score',
                    title: 'SCORE',
                    render: function(data) {
                        const score = parseInt(data) || 0;
                        let badgeClass = 'badge-score-low';
                        if (score >= 40) badgeClass = 'badge-score-high animate-pulse-light';
                        else if (score >= 20) badgeClass = 'badge-score-med';
                        return `<span class="badge ${badgeClass}">${score}</span>`;
                    }
                },
                { 
                    data: 'Nexus Pitch',
                    title: 'PREVIEW',
                    render: function(data) {
                        if (!data) return '-';
                        const isOllama = data.includes('🦅');
                        return `<div style="font-size:0.75rem; color:${isOllama?'#fff':'var(--text-secondary)'}; font-style:italic; max-width:250px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap">${data}</div>`;
                    }
                }
            ],
            pageLength: 25,
            order: [[3, 'desc']],
            dom: '<"mb-4"f>rt<"d-flex justify-content-between align-items-center mt-4"ip>',
            language: {
                search: "",
                searchPlaceholder: "Search Signals..."
            }
        });

        // Row Selection and Sidebar
        $('#leads-table tbody').on('click', 'tr', function() {
            const rowData = table.row(this).data();
            if (!rowData) return;

            $(this).addClass('selected-row').siblings().removeClass('selected-row');
            showLeadDetails(rowData);
        });
    }

    function showLeadDetails(row) {
        const isOllama = row['Nexus Pitch'] && row['Nexus Pitch'].includes('🦅');
        
        const content = `
            <div class="detail-section">
                <div class="d-flex align-items-center mb-4">
                    <div style="width:60px; height:60px; background:linear-gradient(135deg,#6366f1,#8b5cf6); border-radius:16px; display:flex; align-items:center; justify-content:center; font-size:1.5rem; font-weight:bold; color:#fff; box-shadow:0 8px 16px rgba(99,102,241,0.3)">
                        ${(row['Full Name'] || '?').charAt(0)}
                    </div>
                    <div class="ms-3">
                        <h4 class="m-0" style="font-weight:700">${row['Full Name'] || 'Unknown'}</h4>
                        <p class="m-0 text-secondary" style="font-size:0.9rem">${row['Title'] || 'Executive'}</p>
                    </div>
                </div>

                <div class="detail-item">
                    <span class="detail-label">Commercial Channels</span>
                    <div class="d-flex flex-wrap gap-2 mt-2">
                        <a href="mailto:${row['Email']}" class="btn btn-sm btn-outline-light border-secondary">
                            <i class="fa-solid fa-envelope me-2"></i>Email
                        </a>
                        ${row['Phone'] ? `
                        <a href="tel:${row['Phone']}" class="btn btn-sm btn-success">
                            <i class="fa-solid fa-phone me-2"></i>${row['Phone']}
                        </a>` : ''}
                        <a href="https://www.linkedin.com/search/results/all/?keywords=${encodeURIComponent(row['Full Name'] + ' ' + (row['Company'] || ''))}" target="_blank" class="btn btn-sm btn-outline-primary" style="color:#0a66c2; border-color:#0a66c2">
                            <i class="fa-brands fa-linkedin me-2"></i>LinkedIn DM
                        </a>
                    </div>
                </div>

                <div class="detail-item">
                    <span class="detail-label">Nexus Intelligence Pitch</span>
                    <div class="pitch-quote mt-2 ${isOllama ? 'ollama-pitch' : ''}">
                        ${row['Nexus Pitch'] || 'Signal intelligence gathering in progress...'}
                        ${isOllama ? '<div class="mt-2"><span class="ollama-badge"><i class="fa-solid fa-microchip me-1"></i>Local AI Generated</span></div>' : ''}
                    </div>
                </div>

                <div class="detail-item">
                    <span class="detail-label">Technical Stack</span>
                    <div class="mt-2">
                        ${row['Tech Stack'] ? row['Tech Stack'].split(',').map(t => `<span class="badge badge-tech">${t.trim()}</span>`).join(' ') : 'No data'}
                    </div>
                </div>

                <div class="detail-item">
                    <span class="detail-label">Architectural Signals</span>
                    <div class="mt-2 p-3" style="background:rgba(255,255,255,0.03); border-radius:12px; font-size:0.85rem">
                        <div class="d-flex justify-content-between mb-2">
                            <span class="text-secondary">Security Posture</span>
                            <span class="text-light">${row['Security Posture'] || 'Standard'}</span>
                        </div>
                        <div class="d-flex justify-content-between mb-2">
                            <span class="text-secondary">Company Domain</span>
                            <span style="color:var(--accent-color)">${row['Website'] || 'n/a'} ↗</span>
                        </div>
                        <div class="d-flex justify-content-between">
                            <span class="text-secondary">Source Signal</span>
                            <span>${row['Enrichment Source'] || 'Raw'}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        sidebarContent.html(content);
        sidebar.addClass('open');
    }

    function animateValue(id, start, end, duration) {
        const obj = document.getElementById(id);
        if (!obj) return;
        
        if (start === end) {
            obj.innerHTML = end.toLocaleString();
            return;
        }
        const range = end - start;
        let current = start;
        const increment = end > start ? Math.ceil(range / 60) : -1;
        const stepTime = 16;
        
        const timer = setInterval(function() {
            current += increment;
            if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
                obj.innerHTML = end.toLocaleString();
                clearInterval(timer);
            } else {
                obj.innerHTML = current.toLocaleString();
            }
        }, stepTime);
    }
});
