package models

type Challenge struct {
	ID int

	Title       string
	Description string
	Category    string
	Difficulty  string

	Type string

	Points int

	InitialValue int
	Decay        int
	MinValue     int

	Solved     bool
	SolveCount int

	FlagHash      string
	FlagType      string
	CaseSensitive bool

	State       string
	MaxAttempts int

	Author string
	Tags   []string
	Hints  []string
}
