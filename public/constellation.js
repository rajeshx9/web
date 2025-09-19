// 3D Alumni Constellation Network
class AlumniConstellation {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.nodes = [];
        this.connections = [];
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.hoveredNode = null;
        this.animationId = null;
        
        this.init();
        this.createAlumniNetwork();
        this.addEventListeners();
        this.animate();
    }

    init() {
        // Create scene
        this.scene = new THREE.Scene();
        
        // Create camera
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.z = 50;

        // Create renderer
        const canvas = document.getElementById('constellation-canvas');
        this.renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x000000, 0);

        // Add ambient lighting
        const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
        this.scene.add(ambientLight);

        // Add point light
        const pointLight = new THREE.PointLight(0x4169E1, 1, 100);
        pointLight.position.set(10, 10, 10);
        this.scene.add(pointLight);
    }

    createAlumniNetwork() {
        // Alumni data simulation
        const alumniData = [
            { name: 'Sarah Chen', company: 'Google', position: 'Senior Engineer', year: 2018, field: 'Technology' },
            { name: 'Michael Rodriguez', company: 'Meta', position: 'Product Manager', year: 2019, field: 'Technology' },
            { name: 'Emily Johnson', company: 'McKinsey', position: 'Consultant', year: 2017, field: 'Consulting' },
            { name: 'David Kim', company: 'Goldman Sachs', position: 'Analyst', year: 2020, field: 'Finance' },
            { name: 'Lisa Wang', company: 'Tesla', position: 'Design Lead', year: 2016, field: 'Design' },
            { name: 'James Thompson', company: 'Apple', position: 'iOS Developer', year: 2019, field: 'Technology' },
            { name: 'Maria Garcia', company: 'Netflix', position: 'Data Scientist', year: 2018, field: 'Technology' },
            { name: 'Robert Brown', company: 'JP Morgan', position: 'Investment Banker', year: 2017, field: 'Finance' },
            { name: 'Jennifer Lee', company: 'Airbnb', position: 'UX Designer', year: 2020, field: 'Design' },
            { name: 'Alex Kumar', company: 'Microsoft', position: 'Cloud Architect', year: 2016, field: 'Technology' },
            { name: 'Sophie Miller', company: 'BCG', position: 'Senior Consultant', year: 2019, field: 'Consulting' },
            { name: 'Daniel Zhang', company: 'Stripe', position: 'Backend Engineer', year: 2018, field: 'Technology' },
            { name: 'Rachel Adams', company: 'Deloitte', position: 'Manager', year: 2017, field: 'Consulting' },
            { name: 'Kevin Park', company: 'Uber', position: 'Product Designer', year: 2020, field: 'Design' },
            { name: 'Amanda Wilson', company: 'Amazon', position: 'Software Engineer', year: 2019, field: 'Technology' }
        ];

        // Create nodes for each alumni
        alumniData.forEach((alumni, index) => {
            this.createAlumniNode(alumni, index);
        });

        // Create connections between related alumni
        this.createConnections();
    }

    createAlumniNode(alumni, index) {
        // Create node geometry based on field
        let geometry;
        const fieldColors = {
            'Technology': 0x4169E1,    // Blue
            'Finance': 0x50C878,       // Green
            'Consulting': 0xFF6B35,    // Orange
            'Design': 0xDA70D6         // Purple
        };

        const color = fieldColors[alumni.field] || 0x4169E1;
        
        // Different shapes for different fields
        if (alumni.field === 'Technology') {
            geometry = new THREE.SphereGeometry(0.8, 16, 16);
        } else if (alumni.field === 'Finance') {
            geometry = new THREE.BoxGeometry(1.2, 1.2, 1.2);
        } else if (alumni.field === 'Consulting') {
            geometry = new THREE.ConeGeometry(0.8, 1.5, 8);
        } else {
            geometry = new THREE.OctahedronGeometry(1);
        }

        const material = new THREE.MeshPhongMaterial({
            color: color,
            transparent: true,
            opacity: 0.8,
            emissive: color,
            emissiveIntensity: 0.2
        });

        const node = new THREE.Mesh(geometry, material);
        
        // Position nodes in a 3D constellation pattern
        const radius = 20 + Math.random() * 15;
        const theta = (index / alumniData.length) * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        
        node.position.x = radius * Math.sin(phi) * Math.cos(theta);
        node.position.y = radius * Math.sin(phi) * Math.sin(theta);
        node.position.z = radius * Math.cos(phi);

        // Store alumni data with the node
        node.userData = alumni;
        node.userData.originalPosition = node.position.clone();
        node.userData.originalScale = node.scale.clone();

        // Add glow effect
        const glowGeometry = geometry.clone();
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.3,
            side: THREE.BackSide
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        glow.scale.multiplyScalar(1.5);
        node.add(glow);

        this.scene.add(node);
        this.nodes.push(node);

        // Add floating animation
        this.animateNode(node, index);
    }

    animateNode(node, index) {
        const originalY = node.position.y;
        const amplitude = 2;
        const frequency = 0.002;
        const phase = index * 0.5;

        const animate = () => {
            node.position.y = originalY + Math.sin(Date.now() * frequency + phase) * amplitude;
            node.rotation.y += 0.005;
            node.rotation.x += 0.002;
        };

        // Store animation function for later use
        node.userData.animate = animate;
    }

    createConnections() {
        // Create connections between alumni in same field or companies
        for (let i = 0; i < this.nodes.length; i++) {
            for (let j = i + 1; j < this.nodes.length; j++) {
                const node1 = this.nodes[i];
                const node2 = this.nodes[j];
                
                // Connect if same field or same company
                if (node1.userData.field === node2.userData.field || 
                    node1.userData.company === node2.userData.company) {
                    
                    if (Math.random() < 0.3) { // 30% chance of connection
                        this.createConnection(node1, node2);
                    }
                }
            }
        }
    }

    createConnection(node1, node2) {
        const geometry = new THREE.BufferGeometry().setFromPoints([
            node1.position,
            node2.position
        ]);

        const material = new THREE.LineBasicMaterial({
            color: 0x4169E1,
            transparent: true,
            opacity: 0.3
        });

        const line = new THREE.Line(geometry, material);
        line.userData = { node1, node2 };
        
        this.scene.add(line);
        this.connections.push(line);
    }

    addEventListeners() {
        // Mouse move for hover effects
        window.addEventListener('mousemove', (event) => {
            this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

            this.handleMouseMove();
        });

        // Click events for node interaction
        window.addEventListener('click', (event) => {
            this.handleClick(event);
        });

        // Window resize
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    handleMouseMove() {
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.nodes);

        // Reset previous hover state
        if (this.hoveredNode && this.hoveredNode !== intersects[0]?.object) {
            gsap.to(this.hoveredNode.scale, {
                duration: 0.3,
                x: this.hoveredNode.userData.originalScale.x,
                y: this.hoveredNode.userData.originalScale.y,
                z: this.hoveredNode.userData.originalScale.z,
                ease: "power2.out"
            });
            this.hoveredNode = null;
        }

        // Apply hover effect to new node
        if (intersects.length > 0) {
            const node = intersects[0].object;
            if (this.hoveredNode !== node) {
                this.hoveredNode = node;
                gsap.to(node.scale, {
                    duration: 0.3,
                    x: 1.5,
                    y: 1.5,
                    z: 1.5,
                    ease: "power2.out"
                });

                // Highlight connected nodes
                this.highlightConnections(node);
            }
        }

        // Camera subtle movement based on mouse position
        const targetX = this.mouse.x * 5;
        const targetY = this.mouse.y * 5;
        
        gsap.to(this.camera.position, {
            duration: 2,
            x: targetX,
            y: targetY,
            ease: "power1.out"
        });
    }

    highlightConnections(node) {
        // Reset all connections
        this.connections.forEach(connection => {
            gsap.to(connection.material, {
                duration: 0.3,
                opacity: 0.1
            });
        });

        // Highlight connections to this node
        this.connections.forEach(connection => {
            if (connection.userData.node1 === node || connection.userData.node2 === node) {
                gsap.to(connection.material, {
                    duration: 0.3,
                    opacity: 0.8
                });
            }
        });
    }

    handleClick(event) {
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.nodes);

        if (intersects.length > 0) {
            const node = intersects[0].object;
            const alumni = node.userData;

            // Create and show alumni info popup
            this.showAlumniInfo(alumni, event);

            // Animate clicked node
            gsap.to(node.rotation, {
                duration: 1,
                y: node.rotation.y + Math.PI * 2,
                ease: "power2.out"
            });
        }
    }

    showAlumniInfo(alumni, event) {
        // Remove existing popup
        const existingPopup = document.querySelector('.alumni-popup');
        if (existingPopup) {
            existingPopup.remove();
        }

        // Create popup element
        const popup = document.createElement('div');
        popup.className = 'alumni-popup';
        popup.style.cssText = `
            position: fixed;
            top: ${event.clientY + 10}px;
            left: ${event.clientX + 10}px;
            background: linear-gradient(135deg, hsl(220, 25%, 8%) 0%, hsl(220, 20%, 12%) 100%);
            border: 2px solid hsl(240, 100%, 70%, 0.5);
            border-radius: 12px;
            padding: 20px;
            color: hsl(210, 40%, 95%);
            font-family: 'Inter', sans-serif;
            box-shadow: 0 20px 60px hsl(240, 100%, 70%, 0.3);
            backdrop-filter: blur(16px);
            z-index: 1000;
            max-width: 300px;
            opacity: 0;
            transform: translateY(10px);
        `;

        popup.innerHTML = `
            <div class="flex items-start justify-between mb-3">
                <h3 style="color: hsl(240, 100%, 70%); font-size: 1.2em; font-weight: bold; margin: 0;">${alumni.name}</h3>
                <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; color: hsl(210, 40%, 95%); cursor: pointer; font-size: 1.5em; padding: 0;">&times;</button>
            </div>
            <div style="space-y: 8px;">
                <p style="margin: 0; color: hsl(210, 40%, 80%);"><strong>Company:</strong> ${alumni.company}</p>
                <p style="margin: 0; color: hsl(210, 40%, 80%);"><strong>Position:</strong> ${alumni.position}</p>
                <p style="margin: 0; color: hsl(210, 40%, 80%);"><strong>Graduation:</strong> ${alumni.year}</p>
                <p style="margin: 0; color: hsl(210, 40%, 80%);"><strong>Field:</strong> ${alumni.field}</p>
            </div>
            <div style="margin-top: 15px; display: flex; gap: 10px;">
                <button onclick="this.parentElement.parentElement.remove()" style="
                    background: linear-gradient(135deg, hsl(240, 100%, 70%), hsl(280, 100%, 70%));
                    border: none;
                    color: white;
                    padding: 8px 16px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 0.9em;
                    font-weight: 600;
                ">Connect</button>
                <button onclick="this.parentElement.parentElement.remove()" style="
                    background: transparent;
                    border: 2px solid hsl(200, 100%, 80%, 0.5);
                    color: hsl(210, 40%, 95%);
                    padding: 8px 16px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 0.9em;
                    font-weight: 600;
                ">View Profile</button>
            </div>
        `;

        document.body.appendChild(popup);

        // Animate popup appearance
        gsap.to(popup, {
            duration: 0.3,
            opacity: 1,
            y: 0,
            ease: "power2.out"
        });

        // Auto-remove popup after 5 seconds
        setTimeout(() => {
            if (popup.parentElement) {
                gsap.to(popup, {
                    duration: 0.3,
                    opacity: 0,
                    y: -10,
                    ease: "power2.in",
                    onComplete: () => popup.remove()
                });
            }
        }, 5000);
    }

    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());

        // Animate all nodes
        this.nodes.forEach(node => {
            if (node.userData.animate) {
                node.userData.animate();
            }
        });

        // Update connections
        this.connections.forEach(connection => {
            const positions = connection.geometry.attributes.position;
            positions.setXYZ(0, connection.userData.node1.position.x, connection.userData.node1.position.y, connection.userData.node1.position.z);
            positions.setXYZ(1, connection.userData.node2.position.x, connection.userData.node2.position.y, connection.userData.node2.position.z);
            positions.needsUpdate = true;
        });

        // Render the scene
        this.renderer.render(this.scene, this.camera);
    }

    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        // Clean up resources
        this.scene.clear();
        this.renderer.dispose();
    }
}

// Initialize constellation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Wait for canvas element to be available
    const canvas = document.getElementById('constellation-canvas');
    if (canvas) {
        new AlumniConstellation();
    }
});