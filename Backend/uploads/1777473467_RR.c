#include <stdio.h>

int main()
{
    int n;

    printf("Enter number of processes: ");
    scanf("%d",&n);

    int tq;

    printf("Enter Time Quantum: ");
    scanf("%d",&tq);

    // Arrays for process data

    int AT[n];  // Arrival Time
    int BT[n];  // Burst Time
    int RT[n];  // Remaining Time
    int CT[n];  // Completion Time
    int TAT[n]; // Turnaround Time
    int WT[n];  // Waiting Time

    int i;

    // ==========================
    // INPUT SECTION
    // ==========================

    for(i=0;i<n;i++)
    {
        printf("Enter AT and BT for P%d: ",i+1);
        scanf("%d %d",&AT[i],&BT[i]);

        /*
        Remaining Time initially equals Burst Time
        because process has not executed yet
        */

        RT[i] = BT[i];
    }

    int time = 0;      // current CPU time
    int completed = 0; // number of finished processes

    /*
    Loop continues until all processes finish
    */

    while(completed < n)
    {
        int done = 1;

        /*
        Scan all processes one by one
        like circular queue scheduling
        */

        for(i=0;i<n;i++)
        {
            /*
            Process can execute only if

            1) it has arrived
            2) it still has remaining burst time
            */

            if(RT[i] > 0 && AT[i] <= time)
            {
                done = 0;

                /*
                Case 1
                Process needs more time than TQ
                */

                if(RT[i] > tq)
                {
                    /*
                    Run process for TQ time
                    */

                    time += tq;

                    /*
                    Reduce remaining time
                    */

                    RT[i] -= tq;
                }

                /*
                Case 2
                Process will finish within TQ
                */

                else
                {
                    time += RT[i];

                    /*
                    Remaining time becomes zero
                    */

                    RT[i] = 0;

                    /*
                    Record completion time
                    */

                    CT[i] = time;

                    completed++;
                }
            }
        }

        /*
        If no process executed
        CPU stays idle and time moves forward
        */

        if(done == 1)
        {
            time++;
        }
    }

    float totalTAT = 0;
    float totalWT = 0;

    /*
    Calculate TAT and WT
    */

    for(i=0;i<n;i++)
    {
        TAT[i] = CT[i] - AT[i];

        WT[i] = TAT[i] - BT[i];

        totalTAT += TAT[i];

        totalWT += WT[i];
    }

    printf("\nAverage Turnaround Time: %.2f\n",totalTAT/n);
    printf("Average Waiting Time: %.2f\n",totalWT/n);

    return 0;
}
