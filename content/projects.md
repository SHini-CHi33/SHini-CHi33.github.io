<!-- 整个项目卡片外层 -->
<div style="
    display: grid;
    grid-template-columns: 36% minmax(0, 1fr);
    column-gap: 1.25rem;
    align-items: center;
    margin-bottom: 40px;
    padding-bottom: 30px;
    border-bottom: 1px solid #eaeaea;
    width: 100%;
    box-sizing: border-box;
">
    <!-- 左侧视频 -->
    <div style="
        width: 100%;
        min-width: 0;
        aspect-ratio: 16 / 9;
        border-radius: 8px;
        overflow: hidden;
        background: #f1f5f9;
        box-shadow: 0 4px 10px rgba(0,0,0,0.1);
    ">
        <video
            src="/Unitree_Project_web.mp4"
            autoplay
            loop
            muted
            playsinline
            preload="metadata"
            style="
                display: block;
                width: 100%;
                height: 100%;
                object-fit: cover;
                pointer-events: none;
            "
        ></video>
    </div>
    <!-- 右侧文字 -->
    <div style="
        width: 100%;
        min-width: 0;
        overflow-wrap: break-word;
        align-self: center;
    ">
        <h3 style="
            font-size: 1.25em;
            font-weight: bold;
            margin: 0 0 10px 0;
            color: #1e293b;
            line-height: 1.4;
        ">
            Unitree G1 Humanoid Reinforcement Learning Training & Sim2Sim Closed-loop Verification
            <a
                href="/Unitree_Project_web.mp4"
                target="_blank"
                rel="noopener noreferrer"
                style="
                    color: #3b82f6;
                    font-size: 0.85em;
                    text-decoration: none;
                    margin-left: 5px;
                    white-space: nowrap;
                "
            >[Demo]</a>
        </h3>
        <div style="
            font-style: italic;
            color: #64748b;
            margin-bottom: 15px;
            font-size: 0.95em;
            line-height: 1.5;
        ">
            Keywords: PPO, LSTM, Closed-loop validation, Domain Randomization, TensorBoard, MuJoCo, Sim2Sim, TorchScript
        </div>
        <div style="
            color: #475569;
            line-height: 1.5;
            font-size: 0.88em;
        ">
            Built RL training and simulation environments for Unitree G1, completing PPO training and policy export. Conducted single-factor reward parameter comparison experiments. Deployed TorchScript-exported policies to MuJoCo for Sim2Sim closed-loop tracking validation under dynamic velocity commands and GUI-based external force perturbations.
        </div>
    </div>
</div>