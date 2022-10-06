#include <bits/stdc++.h>
using namespace std;
#define ll long long
#define pb push_back
#define all(a) a.begin(), a.end()
#define tr(c, it) for (typeof(c.begin()) it = c.begin(); it != c.end(); it++)
#define present(c, i) (c.ssd(i) != c.end())
#define cpresent(c, i) (ssd(all(c), i) != c.end())
#define LECTSIZE 1
#define LABSIZE 2
#define TUTSIZE 2

string input="";
stringstream ss;
// make 2 graphs 
// firstly it is periods and secondly is all period numbers for bans/allowed period nos.

fstream fin("input.txt",ios::in|ios::out);

class Period
{
public:
    ll id, length;
    string Room, Prof;
    vector<string> Group;
    Period()
    {
        id = -1;
        length = 1; // represents how many colors to assign an edge
        Room = Prof = "none";
    }
};

class Subject
{
public:
    string name;
    vector<Period> Lab, Tut, Lecture;
    ll lectCount, labCount, tutCount;
    Subject()
    {
        name = "none";
    }
};

ll vertices, subjectCount, number = -1, maxColor = 100, maxAllowedClasses = 2, beforeBreak, afterBreak, days, Lects = 0, Labs = 0, Tuts = 0;
vector<vector<ll>> mat;
vector<Subject> subjects;
map<ll, Period> m;
map<ll, ll> p;
bool **allowed;
vector<ll> colors(maxColor, -1), colorLimit(maxColor, maxAllowedClasses);

void display(vector<vector<ll>> &adj)
{
    ll i, j;
    for (i = 0; i < vertices; i++)
    {
        cout << i << "-> ";
        for (j = 0; j < adj[i].size(); j++)
            cout << adj[i][j] << " ";
        cout << "\n";
    }
}

bool groupCheck(vector<string> &a, vector<string> &b)
{
    ll i, j;
    for (i = 0; i < a.size(); i++)
        for (j = 0; j < b.size(); j++)
            if (a[i] == b[j])
                return true;
    return false;
}

void makeIds()
{
    ll i, j, k;
    for (i = 0; i < subjectCount; i++)
    {
        for (j = 0; j < subjects[i].lectCount; j++)
        {
            for (k = 0; k < LECTSIZE; k++)
            {
                cout << subjects[i].Lecture[LECTSIZE * j + k].id << " ";
                m[subjects[i].Lecture[LECTSIZE * j + k].id] = subjects[i].Lecture[LECTSIZE * j + k];
                p[subjects[i].Lecture[LECTSIZE * j + k].id]=k;
            }
        }
        for (j = 0; j < subjects[i].labCount; j++)
        {
            for (k = 0; k < LABSIZE; k++)
            {
                cout << subjects[i].Lab[LABSIZE * j + k].id << " ";
                m[subjects[i].Lab[LABSIZE * j + k].id] = subjects[i].Lab[LABSIZE * j + k];
                p[subjects[i].Lab[LABSIZE * j + k].id]=k;
            }
        }
        for (j = 0; j < subjects[i].tutCount; j++)
        {
            for (k = 0; k < TUTSIZE; k++)
            {
                cout << subjects[i].Tut[TUTSIZE * j + k].id << " ";
                m[subjects[i].Tut[TUTSIZE * j + k].id] = subjects[i].Tut[TUTSIZE * j + k];
                p[subjects[i].Tut[TUTSIZE * j + k].id]=k;
            }
        }
        cout << "\n";
    }
}

bool isSafe(ll vertex, ll c)
{
    ll i;
    if (!allowed[vertex][c] || !colorLimit[c])
        return false;
    for (i = 0; i < mat[vertex].size(); i++)
        if (colors[mat[vertex][i]] == c)
            return false;
    return true;
}

void updateAllowed()
{
    ll i, j, n, k, jump = (beforeBreak + afterBreak);
    allowed = new bool *[vertices];
    for (i = 0; i < vertices; i++)
        allowed[i] = new bool[maxColor];
    for (i = 0; i < vertices; i++)
    {
        for (j = 0; j < maxColor; j++)
            allowed[i][j] = false;
    }
    for (i = 0; i < vertices; i++)
    {
        vector<ll> legal;
        for (j = 0; j + m[i].length - 1 < beforeBreak; j += m[i].length)
        {
            for (k = 0; k < days; k++)
                legal.pb(j + k * jump);
        }
        for (j = beforeBreak; j + m[i].length - 1 < beforeBreak + afterBreak; j += m[i].length)
        {
            for (k = 0; k < days; k++)
                legal.pb(j + k * jump);
        }
        for (auto x : legal)
        {
            allowed[i][x] = true;
        }
    }
    // for (i = 0; i < vertices; i++)
    // {
    //     for (j = 0; j < maxColor; j++)
    //         cout << allowed[i][j] << " ";
    //     cout << "end\n";
    // }
    // for (k = 0; k < vertices; k++)
    // {
    //     cout << "Enter number of bans for " << k << ": ";
    //     ss >> n;
    //     cout << "Enter bans: ";
    //     while (n--)
    //     {
    //         ss >> j;
    //         allowed[k][j] = false;
    //         cout << "banning " << k << " " << j << "\n";
    //     }
    // }
}

void makeGraph()
{
    ll i, j, n;
    vertices = number + 1;
    mat.resize(vertices); // nodes==number, +1 for 0 indexing
    for (i = 0; i < vertices; i++)
    {
        // m[i] gives us ith period as Period, so we have duration factor;
        for (j = i + 1; j < vertices; j++)
        {
            // if ith and jth period have some common then make an edge
            if ((m[i].Prof == m[j].Prof) || (m[i].Room == m[j].Room) || groupCheck(m[i].Group, m[j].Group))
            {
                mat[i].pb(j);
                mat[j].pb(i);
            }
        }
    }
}

void display(vector<ll> &col)
{
    ll i;
    for (i = 0; i < vertices; i++)
        cout << "Color of vertex " << i + 1 << " = " << col[i] + 1 << "\n";
}

bool graphColoring(ll vertex)
{
    if (vertex >= vertices - 1)
        return true;
    ll i, j, n;
    for (i = 0; i < maxColor; i++)
    {
        if (!p[vertex] && isSafe(vertex, i))  //vertex must be 0th part and safe to color with i
        {
            for(j=0;j<m[i].length;j++)
            {
                colors[vertex+j]=i+j;
                colorLimit[i+j]--;
            }
            if (graphColoring(vertex + j))
                return true;
            for(j=0;j<m[i].length;j++)
            {
                colors[vertex+j]=0;
                colorLimit[i+j]++;
            }
        }
    }
    return false;
}

void printTimeTable()
{
    ll i,j;
    map<ll,ll> tt;
    for(i=0;i<vertices;i++)
    {
        tt[colors[i]]=i;   //colors[i] gives color of ith node, tt[i] give node of color[i]
    }
    for(i=0;i<days;i++)
    {
        for(j=0;j<(beforeBreak+afterBreak);j++)
            cout<<setw(3)<<tt[(beforeBreak+afterBreak)*i+j]+1<<" ";
        cout<<"\n";
    }
}

void solve()
{
    getline(fin,input);
    cout<<input<<"\n";
    ss=stringstream(input);
    ll i, groupCount, temp, maxLectCount = -1, maxTutCount = -1, maxLabCount = -1, k, j, size;
    string s1, s2, s3;
    cout << "Number of days college is open: ";
    ss >> days;
    cout << "Number of periods before break: ";
    ss >> beforeBreak;
    cout << "Number of periods after break: ";
    ss >> afterBreak;
    maxColor = (beforeBreak + afterBreak) * days;
    colors.resize(maxColor);
    colorLimit.resize(maxColor);

    cout << "Enter number of subjects: ";
    ss >> subjectCount;
    subjects.resize(subjectCount);
    for (i = 0; i < subjectCount; i++)
    {
        cout << "Enter " << i << " subject name:";
        ss >> subjects[i].name;

        cout << "Number of lectures:";
        ss >> subjects[i].lectCount;
        Lects += subjects[i].lectCount;
        maxLectCount = max(maxLectCount, subjects[i].lectCount);
        if (subjects[i].lectCount)
        {
            size = LECTSIZE;
            subjects[i].Lecture.resize(size * subjects[i].lectCount); // basically initialised lectcount number of periods for lectures
            cout << "Enter lecturer name: ";
            ss >> s1;
            cout << "Enter number of groups attending: ";
            ss >> groupCount;
            vector<string> tempGroup;
            while (groupCount--)
            {
                ss >> s2;
                tempGroup.pb(s2);
            }
            cout << "Enter room: ";
            ss >> s3;
            for (k = 0; k < LECTSIZE; k++)
            {
                for (j = 0; j < subjects[i].lectCount; j++)
                {
                    subjects[i].Lecture[LECTSIZE * j + k].Room = s3;
                    subjects[i].Lecture[LECTSIZE * j + k].Group = tempGroup;
                    subjects[i].Lecture[LECTSIZE * j + k].Prof = s1;
                }
            }
        }
        cout << "Number of tutorials:";
        ss >> subjects[i].tutCount;
        Tuts += subjects[i].tutCount;
        maxTutCount = max(maxTutCount, subjects[i].tutCount);
        if (subjects[i].tutCount)
        {
            // size = subjects[i].Tut[0].length;
            size = TUTSIZE;
            subjects[i].Tut.resize(size * subjects[i].tutCount); // basically 2*tuts periods
            for (j = 0; j < subjects[i].tutCount; j++)
            {
                cout << "Enter tutorial-coordinator name: ";
                ss >> s1;
                cout << "Enter number of groups attending: ";
                ss >> groupCount;
                vector<string> tempGroup;
                while (groupCount--)
                {
                    ss >> s2;
                    tempGroup.pb(s2);
                }
                cout << "Enter room: ";
                ss >> s3;
                for (k = 0; k < size; k++)
                {
                    subjects[i].Tut[size * j + k].Room = s3;
                    subjects[i].Tut[size * j + k].Group = tempGroup;
                    subjects[i].Tut[size * j + k].Prof = s1;
                    subjects[i].Tut[size * j + k].length = size;
                }
            }
        }
        cout << "Number of labs:";
        ss >> subjects[i].labCount;
        maxLabCount = max(maxLabCount, subjects[i].labCount);
        Labs += subjects[i].labCount;
        if (subjects[i].labCount)
        {
            size = LABSIZE;
            subjects[i].Lab.resize(size * subjects[i].labCount); // basically 2*tuts periods
            for (j = 0; j < subjects[i].labCount; j++)
            {
                cout << "Enter tutorial-coordinator name: ";
                ss >> s1;
                cout << "Enter number of groups attending: ";
                ss >> groupCount;
                vector<string> tempGroup;
                while (groupCount--)
                {
                    ss >> s2;
                    tempGroup.pb(s2);
                }
                cout << "Enter room: ";
                ss >> s3;
                for (k = 0; k < size; k++)
                {
                    subjects[i].Lab[size * j + k].Room = s3;
                    subjects[i].Lab[size * j + k].Group = tempGroup;
                    subjects[i].Lab[size * j + k].Prof = s1;
                    subjects[i].Lab[size * j + k].length = size;
                }
            }
        }
    }

    // number lectures across subjects
    for (k = 1; k <= (maxLectCount + maxLabCount + maxTutCount); k++)
    {
        for (i = 0; i < subjectCount; i++) // i is ith subject
        {
            if (subjects[i].lectCount < k)
            {
                // subject i ke tuts dhund fir lab
                if ((subjects[i].tutCount + subjects[i].lectCount) < k)
                {
                    if ((subjects[i].tutCount + subjects[i].lectCount + subjects[i].labCount) < k)
                    {
                        continue;
                    }
                    for (j = 0; j < LABSIZE; j++)
                    {
                        subjects[i].Lab[LABSIZE * (k - subjects[i].tutCount - subjects[i].lectCount - 1) + j].id = ++number;
                    }
                    continue;
                }
                for (j = 0; j < TUTSIZE; j++)
                {
                    subjects[i].Tut[TUTSIZE * (k - subjects[i].lectCount - 1) + j].id = ++number;
                }
                continue;
            }
            for (j = 0; j < LECTSIZE; j++)
                subjects[i].Lecture[LECTSIZE * (k - 1) + j].id = ++number;
        }
    }

    cout << "\n";
    // ids of all
    makeIds();
    makeGraph();

    // cout<<"part numbers:\n";
    // for(i=0;i<vertices;i++)
    // cout<<i<<" "<<p[i]<<"\n";

    // for(i=0;i<vertices;i++)   //print graph
    //     for(j=0;j<mat[i].size();j++)
    //         if(i<mat[i][j])
    //         cout<<i<<" "<<mat[i][j]<<"\n";

    updateAllowed();
    if (graphColoring(0))
        display(colors);
    // display(mat);

    printTimeTable();

}

// int main()
// {
//     ios_base::sync_with_stdio(false);
//     cin.tie(NULL);
//     solve();
//     return 0;
// }