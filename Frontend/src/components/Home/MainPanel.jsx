export default function MainPanel() {
    return (
        <div className="main-grid">

            {/* LEFT → CHALLENGES */}
            <div className="panel">

                <div className="panel-header">
                    <div className="panel-title">
                        <span className="dot"></span>
                        Recent Challenges
                    </div>
                </div>

                {/* TABLE HEADER */}
                <div className="ch-header">
                    <div>Name</div>
                    <div>Points</div>
                    <div>Solves</div>
                    <div>Diff</div>
                    <div>Status</div>
                </div>

                {/* ROW 1 */}
                <div className="challenge-row">
                    <div>
                        <div className="ch-name">SQL Injection 101</div>
                        <div className="ch-desc">Exploit login bypass</div>
                    </div>
                    <div className="ch-pts">100</div>
                    <div className="ch-solves">32</div>
                    <div>
                        <span className="diff-badge diff-easy">Easy</span>
                    </div>
                    <div>✔</div>
                </div>

                {/* ROW 2 */}
                <div className="challenge-row">
                    <div>
                        <div className="ch-name">Buffer Overflow</div>
                        <div className="ch-desc">Smash the stack</div>
                    </div>
                    <div className="ch-pts">250</div>
                    <div className="ch-solves">12</div>
                    <div>
                        <span className="diff-badge diff-hard">Hard</span>
                    </div>
                    <div></div>
                </div>

                {/* ROW 3 */}
                <div className="challenge-row">
                    <div>
                        <div className="ch-name">Crypto Puzzle</div>
                        <div className="ch-desc">Decode the cipher</div>
                    </div>
                    <div className="ch-pts">150</div>
                    <div className="ch-solves">20</div>
                    <div>
                        <span className="diff-badge diff-med">Medium</span>
                    </div>
                    <div></div>
                </div>

            </div>

            {/* RIGHT → LEADERBOARD */}
            <div className="panel">

                <div className="panel-header">
                    <div className="panel-title">
                        <span className="dot"></span>
                        Leaderboard
                    </div>
                </div>

                {/* PLAYER 1 */}
                <div className="lb-row">
                    <div className="lb-rank gold">1</div>
                    <div className="lb-avatar">HX</div>
                    <div className="lb-info">
                        <div className="lb-name">HackerX</div>
                    </div>
                    <div className="lb-score">1200</div>
                </div>

                {/* PLAYER 2 */}
                <div className="lb-row">
                    <div className="lb-rank silver">2</div>
                    <div className="lb-avatar">CP</div>
                    <div className="lb-info">
                        <div className="lb-name">CyberPro</div>
                    </div>
                    <div className="lb-score">950</div>
                </div>

                {/* PLAYER 3 */}
                <div className="lb-row">
                    <div className="lb-rank bronze">3</div>
                    <div className="lb-avatar">NX</div>
                    <div className="lb-info">
                        <div className="lb-name">NullX</div>
                    </div>
                    <div className="lb-score">870</div>
                </div>

            </div>

        </div>
    );
}